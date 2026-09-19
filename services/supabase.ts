import { createClient } from '@supabase/supabase-js';

// Read from environment variables only
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for the app.
// Guarded so the app still runs if the URL/key are missing or WebSocket is unavailable.
let supabase: any = null;
try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  supabase = null;
}

export { supabase };

export interface SupabaseBooking {
  id: string;
  booking_type: 'hourly' | 'supplier';
  status: string;
  details: any;
  created_at?: string;
}

/**
 * Fetch all bookings stored in Supabase — paginated to bypass 1000 limit
 */
export const fetchAllBookings = async (): Promise<SupabaseBooking[]> => {
  try {
    let all: SupabaseBooking[] = [];
    let from = 0; const step = 1000;
    while(true){
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, from+step-1);
      if (error) {
        console.warn('Supabase fetch bookings error:', error.message);
        return all;
      }
      if(!data||!data.length) break;
      all = all.concat(data);
      if(data.length < step) break;
      from += step;
    }
    return all;
  } catch (err: any) {
    console.error('Failed to fetch bookings from Supabase:', err?.message || err);
    return [];
  }
};

/**
 * Save or update a booking in Supabase
 */
export const saveBooking = async (
  id: string,
  bookingType: 'hourly' | 'supplier',
  status: string,
  details: any
) => {
  try {
    // Attempt specific table write
    const { error } = await supabase
      .from('bookings')
      .upsert({
        id,
        booking_type: bookingType,
        status,
        details,
        created_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase bookings upsert warning:', error.message);
    }

    // Also write to a general submissions table for unified reporting
    await saveSubmission('booking', {
      id,
      booking_type: bookingType,
      status,
      ...details
    });
  } catch (err: any) {
    console.error('Failed to save booking to Supabase:', err?.message || err);
  }
};

/**
 * Delete a booking from Supabase
 */
export const removeBooking = async (id: string) => {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Supabase bookings delete warning:', error.message);
    }
    
    // Also remove from general submissions table
    await removeSubmission(id);
  } catch (err: any) {
    console.error('Failed to delete booking from Supabase:', err?.message || err);
  }
};

/**
 * Save generic submissions (Registrations, Contact Us, Property listings, Jobs, Service requests)
 * Fallback-only mode (option 2): uses bookings table only to avoid 404s when setup.sql
 * has not been run and user has no dashboard access. When setup.sql is run, set
 * USE_SUBMISSIONS_TABLES = true to re-enable typed mirror + submissions writes.
 */
const USE_SUBMISSIONS_TABLES = false;
export const saveSubmission = async (type: string, data: any) => {
  const id = data.id || Date.now().toString();
  const payload = {
    id,
    type,
    status: data.status || 'Pending',
    data: data,
    created_at: new Date().toISOString()
  };

  let remoteSaved = false;

  if (!supabase) {
    console.warn('Supabase not configured (missing VITE_SUPABASE_URL/KEY) — saving locally only.');
  } else {
    if (USE_SUBMISSIONS_TABLES) {
      // 1. Try writing to a specific table (e.g., contacts, registrations)
      const specificTable =
        type === 'contact' ? 'contacts' :
        type === 'registration' ? 'registrations' :
        type === 'property' ? 'properties' :
        type === 'job' ? 'jobs' :
        type === 'application' ? 'applications' :
        type === 'service_request' ? 'service_requests' : null;

      if (specificTable) {
        try {
          const { error: specificErr } = await supabase
            .from(specificTable)
            .upsert({
              id,
              status: payload.status,
              data: data,
              created_at: payload.created_at
            }, { onConflict: 'id' });
          
          if (!specificErr) remoteSaved = true;
          else if (specificErr.code !== 'PGRST205') {
            console.warn(`Supabase specific table "${specificTable}" upsert warning:`, specificErr.message);
          }
        } catch (e: any) {
          // Table might not exist, proceed
        }
      }

      // 2. Write to the general submissions table (if it exists)
      try {
        const { error } = await supabase
          .from('submissions')
          .upsert(payload, { onConflict: 'id' });
        if (!error) remoteSaved = true;
        else if (error.code !== 'PGRST205') {
          console.warn('Supabase generic submissions upsert warning:', error.message);
        }
      } catch (e: any) {
        // table missing
      }
    }

    // 3. Final fallback — bookings table ALWAYS exists (verified live). Store as booking_type=type
    // This is the critical remote save that currently succeeds for 'hourly'/'supplier'.
    try {
      const { error: bookingsErr } = await supabase
        .from('bookings')
        .upsert({
          id,
          booking_type: type,
          status: payload.status,
          details: data,
          created_at: payload.created_at
        }, { onConflict: 'id' });
      if (!bookingsErr) remoteSaved = true;
      else {
        console.warn('Supabase bookings fallback upsert warning:', bookingsErr.message);
      }
    } catch (e: any) {
      console.error('Supabase bookings fallback failed:', e?.message || e);
    }

    if (!remoteSaved) {
      console.error(`Supabase saveSubmission remote save FAILED for type="${type}" id=${id}. All tables missing or RLS blocked. Check Supabase SQL Editor: run setup.sql. Data kept locally only.`);
    }
  }

  // Save locally to ensure persistent rendering in case of database access issues
  try {
    const localKey = `const_mart_local_${type}s`;
    const existing = localStorage.getItem(localKey);
    const list = existing ? JSON.parse(existing) : [];
    const index = list.findIndex((item: any) => item.id === id);
    if (index > -1) {
      list[index] = { ...list[index], ...data };
    } else {
      list.unshift({ id, ...data });
    }
    localStorage.setItem(localKey, JSON.stringify(list));
  } catch (e) {}
};

/**
 * Remove general submission — tries submissions + bookings
 */
export const removeSubmission = async (id: string) => {
  if (!supabase) return;
  if (USE_SUBMISSIONS_TABLES) {
    try {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', id);
      if (error && error.code !== 'PGRST205') {
        console.warn('Supabase submissions delete warning:', error.message);
      }
    } catch (err: any) {}
  }
  // Also remove bookings fallback row (where saveSubmission stored it)
  try {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) console.warn('Supabase bookings delete warning:', error.message);
  } catch (err: any) {
    console.error('Failed to remove submission:', err?.message || err);
  }
};

let submissionsCache: any[] | null = null;
let submissionsCacheAt = 0;
const SUBMISSIONS_CACHE_MS = 10000;
/**
 * Fetch all submissions for the Admin Panel
 * Fallback-only mode: reads directly from bookings to avoid 404 on submissions
 * Paginated to bypass 1000 limit for large datasets (users) + cached to avoid loop
 */
export const fetchAllSubmissions = async (): Promise<any[]> => {
  if (!supabase) return [];
  if(submissionsCache && Date.now() - submissionsCacheAt < SUBMISSIONS_CACHE_MS) return submissionsCache;
  if (USE_SUBMISSIONS_TABLES) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length) {
        submissionsCache = data; submissionsCacheAt = Date.now();
        return data;
      }
      if (error && error.code !== 'PGRST205') {
        console.warn('Supabase fetch submissions warning:', error.message);
      }
    } catch (err: any) {}
  }
  try {
    let all: any[] = [];
    let from = 0; const step = 1000;
    while(true){
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, from+step-1);
      if (error) { console.warn('Supabase fetch bookings fallback warning:', error.message); return all; }
      if(!data||!data.length) break;
      all = all.concat(data);
      if(data.length < step) break;
      from += step;
    }
    const filtered = all.filter((r: any) => !['hourly','supplier'].includes(r.booking_type));
    const res = filtered.map((r: any) => ({
      id: r.id,
      type: r.booking_type,
      status: r.status,
      data: r.details,
      created_at: r.created_at,
    }));
    submissionsCache = res; submissionsCacheAt = Date.now();
    return res;
  } catch (err: any) {
    console.error('Failed to fetch submissions fallback:', err?.message || err);
    return [];
  }
};

/**
 * Fetch only chat_message bookings — used by chat polling to avoid fetching 1075 registrations every 4s
 */
export const fetchChatMessages = async (): Promise<any[]> => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_type', 'chat_message')
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) {
      console.warn('fetchChatMessages warning:', error.message);
      return [];
    }
    return (data || []).map((r: any) => ({
      id: r.id,
      type: r.booking_type,
      status: r.status,
      data: r.details,
      created_at: r.created_at,
    }));
  } catch (err: any) {
    console.error('fetchChatMessages failed:', err?.message || err);
    return [];
  }
};
