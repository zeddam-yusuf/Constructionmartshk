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
  'JOB',
  'FREELANCER',
  'BROKER',
] as const;

export const SUPERADMIN_ROLE = 'SUPERADMIN';

export interface StoredUser {
  id: string;
  name: string;
  phone: string;
  role: string;
  password_hash: string;
  status: 'active' | 'blocked';
  email?: string;
  city?: string;
  companyName?: string;
  category?: string;
  experience?: string;
  charges?: string;
  gstNumber?: string;
  created_at: string;
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

// ---- Mapping between camelCase (app) and snake_case (Supabase columns) ----
const toUserRow = (u: StoredUser) => ({
  id: u.id,
  name: u.name,
  phone: u.phone,
  role: u.role,
  password_hash: u.password_hash,
  status: u.status,
  email: u.email || null,
  city: u.city || null,
  company_name: u.companyName || null,
  category: u.category || null,
  experience: u.experience || null,
  charges: u.charges || null,
  gst_number: u.gstNumber || null,
  created_at: u.created_at,
});

const fromUserRow = (r: any): StoredUser => ({
  id: r.id,
  name: r.name,
  phone: r.phone,
  role: r.role,
  password_hash: r.password_hash,
  status: r.status || 'active',
  email: r.email,
  city: r.city,
  companyName: r.company_name,
  category: r.category,
  experience: r.experience,
  charges: r.charges,
  gstNumber: r.gst_number,
  created_at: r.created_at,
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
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('auth_users')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length) return data.map(fromUserRow);
    } catch (e) {
      // fall through to local
    }
  }
  return localUsers();
};

export const dbFindUserByPhone = async (phone: string): Promise<StoredUser | null> => {
  const list = await dbListUsers();
  return list.find((u) => u.phone === phone) || null;
};

export const dbFindUserById = async (id: string): Promise<StoredUser | null> => {
  const list = await dbListUsers();
  return list.find((u) => u.id === id) || null;
};

export const dbUpsertUser = async (user: StoredUser): Promise<void> => {
  if (supabase) {
    try {
      await supabase.from('auth_users').upsert(toUserRow(user), { onConflict: 'phone' });
    } catch (e) {
      // local mirror keeps working
    }
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
      await supabase.from('auth_users').update(toUserRow(updated)).eq('id', id);
    } catch (e) {
      // ignore
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
    try {
      await supabase.from('auth_users').delete().eq('id', id);
    } catch (e) {
      // ignore
    }
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
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length) return data.map(fromJobRow);
    } catch (e) {
      // fall through to local
    }
  }
  return localJobs();
};

export const dbUpsertJob = async (job: StoredJob): Promise<void> => {
  if (supabase) {
    try {
      await supabase.from('jobs').upsert(toJobRow(job), { onConflict: 'id' });
    } catch (e) {
      // ignore
    }
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
      await supabase.from('jobs').update(toJobRow(updated)).eq('id', id);
    } catch (e) {
      // ignore
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
    try {
      await supabase.from('jobs').delete().eq('id', id);
    } catch (e) {
      // ignore
    }
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