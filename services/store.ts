// Client-side data store for auth users and job listings.
// Persists to Supabase when available (RLS policies allow anon access) and always
// mirrors to localStorage so the app is fully standalone / offline-friendly.

import { supabase } from './supabase';

export const VALID_ROLES = [
  'CLIENT',
  'VENDOR',
  'PMC',
  'CHANNEL_PARTNER',
  'LABOUR',
  'MATERIAL_SUPPLIER',
  'JOB SEEKER',
  'FREELANCER',
  'BROKER',
] as const;

export const SUPERADMIN_ROLE = 'SUPERADMIN';

export interface StoredUser {
  id: string;
  name: string;
  role: string;
  category?: string;
  password_hash: string;
  subCategory?: string;
  state?: string;
  city?: string;
  remarks?: string;
  experience?: string;
  gstNumber?: string;
  charges?: string;
  email?: string;
  status: 'active' | 'blocked';
  phone: string;
  created_at: string;
  // deprecated alias for backwards compat (company_name -> remarks/subCategory)
  companyName?: string;
}

export interface StoredJob {
  id: string;
  title: string;
  role: string;
  location: string;
  salary: string;
  type: string;
  description?: string;
  status: 'Open' | 'Closed' | 'Filled';
  created_at: string;
}

const USERS_KEY = 'cm_users_store';
const JOBS_KEY = 'cm_jobs_store';

// Fallback-only mode: set to false to avoid 404s on missing tables (auth_users/jobs/submissions)
// when setup.sql has not been run and user has no dashboard access.
// Set to true after setup.sql is run to use native tables.
const USE_AUTH_TABLES = false;
const USE_JOBS_TABLE = false;

// Simple in-memory cache to avoid fetching 1075 rows repeatedly (fixes login loop)
let usersCache: StoredUser[] | null = null;
let usersCacheAt = 0;
const USERS_CACHE_MS = 30000; // 30s
let usersFetchInFlight: Promise<StoredUser[]> | null = null;

// ---- Mapping between camelCase (app) and snake_case (Supabase columns) ----
// Schema order: ID, NAME, ROLE, CATEGORY, password_hash, SUB_CATEGORY, STATE, CITY, REMARKS, experience, gst_number, charges, email, status, phone
const toUserRow = (u: StoredUser) => ({
  id: u.id,
  name: u.name,
  role: u.role,
  category: u.category || null,
  password_hash: u.password_hash,
  sub_category: u.subCategory || (u as any).companyName || null,
  state: u.state || null,
  city: u.city || null,
  remarks: u.remarks || null,
  experience: u.experience || null,
  gst_number: u.gstNumber || null,
  charges: u.charges || null,
  email: u.email || null,
  status: u.status,
  phone: u.phone,
  created_at: u.created_at,
});

const fromUserRow = (r: any): StoredUser => ({
  id: r.id,
  name: r.name,
  role: r.role === 'JOB' ? 'JOB SEEKER' : r.role,
  category: r.category,
  password_hash: r.password_hash,
  subCategory: r.sub_category || r.company_name || undefined,
  state: r.state,
  city: r.city,
  remarks: r.remarks,
  experience: r.experience,
  gstNumber: r.gst_number,
  charges: r.charges,
  email: r.email,
  status: r.status || 'active',
  phone: r.phone,
  created_at: r.created_at,
  companyName: r.company_name || r.sub_category || undefined,
});

const toJobRow = (j: StoredJob) => ({
  id: j.id,
  title: j.title,
  role: j.role,
  location: j.location,
  salary: j.salary,
  type: j.type,
  description: j.description || null,
  status: j.status,
  created_at: j.created_at,
});

const fromJobRow = (r: any): StoredJob => ({
  id: r.id,
  title: r.title,
  role: r.role,
  location: r.location,
  salary: r.salary,
  type: r.type,
  description: r.description,
  status: r.status || 'Open',
  created_at: r.created_at,
});

// ---- localStorage helpers ----
const localUsers = (): StoredUser[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const setLocalUsers = (list: StoredUser[]) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
  } catch (e) {
    // ignore
  }
};

const localJobs = (): StoredJob[] => {
  try {
    const raw = localStorage.getItem(JOBS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const setLocalJobs = (list: StoredJob[]) => {
  try {
    localStorage.setItem(JOBS_KEY, JSON.stringify(list));
  } catch (e) {
    // ignore
  }
};

// ---- Users ----
export const dbListUsers = async (): Promise<StoredUser[]> => {
  if(usersCache && Date.now() - usersCacheAt < USERS_CACHE_MS) return usersCache;
  if (supabase) {
    try {
      if (USE_AUTH_TABLES) {
        const { data, error } = await supabase
          .from('auth_users')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length) {
          const mapped = data.map(fromUserRow);
          usersCache = mapped; usersCacheAt = Date.now();
          return mapped;
        }
        if (error && error.code && error.code !== 'PGRST205') {
          console.warn('dbListUsers auth_users warning:', error.message);
        }
        // If auth_users succeeded with data we already returned; otherwise fall through to bookings fallback
        // when PGRST205 or empty
        if (error && error.code !== 'PGRST205' && error) {
          // non-205 error already warned, still try fallback
        }
      }
      // Bookings fallback — primary when USE_AUTH_TABLES=false (avoids 404 PGRST205)
      // Paginate (Supabase default limit 1000) to fetch all 1074+
      {
        let bData: any[] = [];
        let bErr: any = null;
        let from = 0; const step = 1000;
        while(true){
          const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('booking_type', 'registration')
            .order('created_at', { ascending: false })
            .range(from, from+step-1);
          if(error){ bErr=error; break; }
          if(!data||!data.length) break;
          bData = bData.concat(data);
          if(data.length < step) break;
          from += step;
        }
        if (!bErr && bData && bData.length) {
          // Map bookings.details back to StoredUser shape where possible
          const mappedAll: StoredUser[] = bData.map((r: any) => {
            const d = r.details || {};
            let rawRole = (d.role || d.category || 'CLIENT').toString().trim().toUpperCase();
            if(rawRole === 'JOB') rawRole = 'JOB SEEKER';
            // normalize preserving space for JOB SEEKER, replace other invalid chars with space then collapse
            rawRole = rawRole.replace(/[^A-Z ]/g, ' ').replace(/\s+/g,' ').trim();
            if(rawRole === 'JOB SEEKER') rawRole = 'JOB SEEKER';
            return {
              id: d.id || r.id,
              name: d.fullName || d.name || 'Unknown',
              role: rawRole,
              category: d.category || d.CATEGORY,
              password_hash: d.password_hash || '',
              subCategory: d.subCategory || d.sub_category || d.companyName || d.company || d.COMPANY,
              state: d.state || d.STATE,
              city: d.city || d.CITY || d.location,
              remarks: d.remarks || d.REMARKS,
              experience: d.experience,
              gstNumber: d.gstNumber || d.gst_number,
              charges: d.charges || d.rate || d.RATE,
              email: d.email,
              status: (d.status === 'Verified Live' || d.status === 'active' ? 'active' : 'active') as any,
              phone: d.mobile || d.phone || d.contact || '',
              created_at: r.created_at || d.created_at || new Date().toISOString(),
              companyName: d.companyName || d.company || d.COMPANY || d.subCategory || d.sub_category,
            };
          }).filter((u: StoredUser) => u.phone);
          // Deduplicate by phone — prefer entry WITH password_hash (real login) over profile-only rows
          const byPhone = new Map<string, StoredUser>();
          for (const u of mappedAll) {
            const existing = byPhone.get(u.phone);
            if (!existing) byPhone.set(u.phone, u);
            else {
              const existingHasPw = !!existing.password_hash;
              const curHasPw = !!u.password_hash;
              if (!existingHasPw && curHasPw) byPhone.set(u.phone, u);
              else if (existingHasPw === curHasPw && new Date(u.created_at).getTime() > new Date(existing.created_at).getTime()) {
                // both have or both lack pw — keep newer only if existing lacks pw?
                // keep existing if it has pw and cur doesn't
                if (!existingHasPw) byPhone.set(u.phone, u);
              }
            }
          }
           const mapped = Array.from(byPhone.values());
           if (mapped.length) { usersCache = mapped; usersCacheAt = Date.now(); return mapped; }
         }
       }
     } catch (e) {
       // fall through to local
     }
   }
   const fallback = localUsers();
   usersCache = fallback; usersCacheAt = Date.now();
   return fallback;
};

export const dbFindUserByPhone = async (phone: string): Promise<StoredUser | null> => {
  const list = await dbListUsers();
  const candidates = list.filter((u) => u.phone === phone);
  if (!candidates.length) return null;
  // Prefer entry with password_hash
  const withPw = candidates.filter((u) => !!u.password_hash);
  if (withPw.length) {
    // most recent among those with pw
    withPw.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return withPw[0];
  }
  return candidates[0];
};

export const dbFindUserById = async (id: string): Promise<StoredUser | null> => {
  const list = await dbListUsers();
  return list.find((u) => u.id === id) || null;
};

export const dbUpsertUser = async (user: StoredUser): Promise<void> => {
  let remoteSaved = false;
  if (supabase) {
    try {
      if (USE_AUTH_TABLES) {
        const { error } = await supabase.from('auth_users').upsert(toUserRow(user), { onConflict: 'phone' });
        if (!error) remoteSaved = true;
        else if (error.code === 'PGRST205') {
          const { error: bErr } = await supabase.from('bookings').upsert({
            id: user.id,
            booking_type: 'registration',
            status: user.status,
            details: { ...user, fullName: user.name, mobile: user.phone, phone: user.phone },
            created_at: user.created_at,
          }, { onConflict: 'id' });
          if (!bErr) remoteSaved = true;
          else console.warn('dbUpsertUser bookings fallback warning:', bErr.message);
        } else {
          console.warn('dbUpsertUser auth_users warning:', error.message);
        }
      } else {
        // Fallback-only mode: write directly to bookings (avoids 404 on auth_users)
        const { error: bErr } = await supabase.from('bookings').upsert({
          id: user.id,
          booking_type: 'registration',
          status: user.status,
          details: { ...user, fullName: user.name, mobile: user.phone, phone: user.phone },
          created_at: user.created_at,
        }, { onConflict: 'id' });
        if (!bErr) remoteSaved = true;
        else console.warn('dbUpsertUser bookings fallback warning:', bErr.message);
      }
    } catch (e: any) {
      console.warn('dbUpsertUser failed:', e?.message || e);
    }
  }
  if (!remoteSaved && supabase) {
    console.warn(`dbUpsertUser remote save failed for phone=${user.phone}. Saved locally only. Run setup.sql in Supabase SQL Editor to create auth_users table.`);
  }
  const list = localUsers();
  const idx = list.findIndex((u) => u.phone === user.phone);
  if (idx > -1) list[idx] = user;
  else list.unshift(user);
  setLocalUsers(list);
};

export const dbUpdateUser = async (id: string, patch: Partial<StoredUser>): Promise<StoredUser | null> => {
  const current = await dbFindUserById(id);
  if (!current) return null;
  const updated: StoredUser = { ...current, ...patch };
  if (supabase) {
    try {
      if (USE_AUTH_TABLES) {
        const { error } = await supabase.from('auth_users').update(toUserRow(updated)).eq('id', id);
        if (error && error.code === 'PGRST205') {
          await supabase.from('bookings').update({
            status: updated.status,
            details: { ...updated, fullName: updated.name, mobile: updated.phone },
          }).eq('id', id);
        } else if (error) {
          console.warn('dbUpdateUser warning:', error.message);
        }
      } else {
        const { error } = await supabase.from('bookings').update({
          status: updated.status,
          details: { ...updated, fullName: updated.name, mobile: updated.phone },
        }).eq('id', id);
        if (error) console.warn('dbUpdateUser bookings warning:', error.message);
      }
    } catch (e: any) {
      console.warn('dbUpdateUser failed:', e?.message || e);
    }
  }
  const list = localUsers();
  const idx = list.findIndex((u) => u.id === id);
  if (idx > -1) list[idx] = updated;
  setLocalUsers(list);
  return updated;
};

export const dbDeleteUser = async (id: string): Promise<boolean> => {
  if (supabase) {
    if (USE_AUTH_TABLES) {
      try {
        const { error } = await supabase.from('auth_users').delete().eq('id', id);
        if (error && error.code === 'PGRST205') {
          await supabase.from('bookings').delete().eq('id', id);
        } else if (error) {
          console.warn('dbDeleteUser warning:', error.message);
        }
      } catch (e: any) {}
    }
    // Always also try bookings fallback row (sole store when USE_AUTH_TABLES=false)
    try { await supabase.from('bookings').delete().eq('id', id); } catch (e) {}
  }
  const list = localUsers();
  const idx = list.findIndex((u) => u.id === id);
  if (idx < 0) return false;
  list.splice(idx, 1);
  setLocalUsers(list);
  return true;
};

// ---- Jobs ----
export const dbListJobs = async (): Promise<StoredJob[]> => {
  if (supabase) {
    try {
      if (USE_JOBS_TABLE) {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length) return data.map(fromJobRow);
        if (error && error.code === 'PGRST205') {
          // Fallback to bookings where booking_type='job'
        } else if (error) {
          console.warn('dbListJobs warning:', error.message);
        } else if (!error && (!data || data.length === 0)) {
          // empty jobs table, also check bookings fallback
        }
      }
      // Bookings fallback — primary when USE_JOBS_TABLE=false (avoids 404) — paginated
      {
        let bData: any[] = []; let bErr: any = null;
        let from=0; const step=1000;
        while(true){
          const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('booking_type', 'job')
            .order('created_at', { ascending: false })
            .range(from, from+step-1);
          if(error){ bErr=error; break; }
          if(!data||!data.length) break;
          bData=bData.concat(data);
          if(data.length<step) break;
          from+=step;
        }
        if (!bErr && bData && bData.length) {
          return bData.map((r: any) => {
            const d = r.details || {};
            return {
              id: r.id,
              title: d.title || r.id,
              role: d.role || 'General',
              location: d.location || 'Remote',
              salary: d.salary || 'Negotiable',
              type: d.type || 'Full-time',
              status: (r.status as StoredJob['status']) || 'Open',
              description: d.description,
              created_at: r.created_at,
            };
          });
        }
        if (USE_JOBS_TABLE && bErr) {
          // only warn when trying jobs table
        }
        if (USE_JOBS_TABLE) return localJobs(); // if jobs table empty and no bookings, return local
        if (!USE_JOBS_TABLE && bData && bData.length === 0) return localJobs();
      }
    } catch (e) {
      // fall through to local
    }
  }
  return localJobs();
};

export const dbUpsertJob = async (job: StoredJob): Promise<void> => {
  let remoteSaved = false;
  if (supabase) {
    try {
      if (USE_JOBS_TABLE) {
        const { error } = await supabase.from('jobs').upsert(toJobRow(job), { onConflict: 'id' });
        if (!error) remoteSaved = true;
        else if (error.code === 'PGRST205') {
          const { error: bErr } = await supabase.from('bookings').upsert({
            id: job.id,
            booking_type: 'job',
            status: job.status,
            details: job,
            created_at: job.created_at,
          }, { onConflict: 'id' });
          if (!bErr) remoteSaved = true;
          else console.warn('dbUpsertJob bookings fallback warning:', bErr.message);
        } else {
          console.warn('dbUpsertJob warning:', error.message);
        }
      } else {
        const { error: bErr } = await supabase.from('bookings').upsert({
          id: job.id,
          booking_type: 'job',
          status: job.status,
          details: job,
          created_at: job.created_at,
        }, { onConflict: 'id' });
        if (!bErr) remoteSaved = true;
        else console.warn('dbUpsertJob bookings fallback warning:', bErr.message);
      }
    } catch (e: any) {
      console.warn('dbUpsertJob failed:', e?.message || e);
    }
  }
  if (!remoteSaved && supabase) {
    console.warn(`dbUpsertJob remote save failed for id=${job.id}. Saved locally only. Run setup.sql.`);
  }
  const list = localJobs();
  const idx = list.findIndex((j) => j.id === job.id);
  if (idx > -1) list[idx] = job;
  else list.unshift(job);
  setLocalJobs(list);
};

export const dbUpdateJob = async (id: string, patch: Partial<StoredJob>): Promise<StoredJob | null> => {
  const list = await dbListJobs();
  const current = list.find((j) => j.id === id);
  if (!current) return null;
  const updated: StoredJob = { ...current, ...patch };
  if (supabase) {
    try {
      if (USE_JOBS_TABLE) {
        const { error } = await supabase.from('jobs').update(toJobRow(updated)).eq('id', id);
        if (error && error.code === 'PGRST205') {
          await supabase.from('bookings').update({ status: updated.status, details: updated }).eq('id', id);
        } else if (error) {
          console.warn('dbUpdateJob warning:', error.message);
        }
      } else {
        const { error } = await supabase.from('bookings').update({ status: updated.status, details: updated }).eq('id', id);
        if (error) console.warn('dbUpdateJob bookings warning:', error.message);
      }
    } catch (e: any) {
      console.warn('dbUpdateJob failed:', e?.message || e);
    }
  }
  const local = localJobs();
  const idx = local.findIndex((j) => j.id === id);
  if (idx > -1) local[idx] = updated;
  setLocalJobs(local);
  return updated;
};

export const dbDeleteJob = async (id: string): Promise<boolean> => {
  if (supabase) {
    if (USE_JOBS_TABLE) {
      try {
        const { error } = await supabase.from('jobs').delete().eq('id', id);
        if (error && error.code === 'PGRST205') {
          await supabase.from('bookings').delete().eq('id', id);
        } else if (error) {
          console.warn('dbDeleteJob warning:', error.message);
        }
      } catch (e: any) {}
    }
    try { await supabase.from('bookings').delete().eq('id', id); } catch (e) {}
  }
  const list = localJobs();
  const idx = list.findIndex((j) => j.id === id);
  if (idx < 0) return false;
  list.splice(idx, 1);
  setLocalJobs(list);
  return true;
};

export const seedSampleJobs = async (): Promise<void> => {
  const existing = await dbListJobs();
  if (existing.length > 0) return;
  const now = new Date().toISOString();
  const samples: StoredJob[] = [
    { id: 'job-sample-1', title: 'Senior Site Supervisor (RCC)', role: 'Civil Engineer', location: 'Mumbai, Andheri', salary: '₹45,000 / month', type: 'Full-time', status: 'Open', created_at: now },
    { id: 'job-sample-2', title: 'Structural Draftsman (AutoCAD)', role: 'Draftsman', location: 'Pune', salary: '₹28,000 / month', type: 'Full-time', status: 'Open', created_at: now },
    { id: 'job-sample-3', title: 'Safety Officer (Construction)', role: 'Safety Officer', location: 'Noida Sector 62', salary: '₹38,000 / month', type: 'Full-time', status: 'Open', created_at: now },
    { id: 'job-sample-4', title: 'Project Quantity Surveyor', role: 'Quantity Surveyor', location: 'Delhi NCR', salary: '₹55,000 / month', type: 'Contract', status: 'Closed', created_at: now },
    { id: 'job-sample-5', title: 'Interior Project Head', role: 'Interior Designer', location: 'Bangalore', salary: '₹50,000 / month', type: 'Full-time', status: 'Filled', created_at: now },
  ];
  for (const job of samples) await dbUpsertJob(job);
};