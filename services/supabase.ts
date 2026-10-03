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
 * Fetch all bookings stored in Supabase
 */
export const fetchAllBookings = async (): Promise<SupabaseBooking[]> => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }
    return data || [];
  } catch (err: any) {
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
  const createdAt = new Date().toISOString();
  const submissionData = {
    id,
    booking_type: bookingType,
    status,
    ...details
  };

  if (supabase) {
    try {
      // Write to the bookings table with valid booking_type ('hourly' | 'supplier')
      await supabase
        .from('bookings')
        .upsert({
          id,
          booking_type: bookingType,
          status,
          details,
          created_at: createdAt
        }, { onConflict: 'id' });

      // Mirror to general submissions table if it exists (without re-upserting bookings as type="booking")
      await supabase
        .from('submissions')
        .upsert({
          id,
          type: 'booking',
          status: status || 'Pending',
          data: submissionData,
          created_at: createdAt
        }, { onConflict: 'id' });
    } catch (err: any) {
      // Fallback to localStorage below
    }
  }

  try {
    const localKey = 'const_mart_local_bookings';
    const existing = localStorage.getItem(localKey);
    const list = existing ? JSON.parse(existing) : [];
    const index = list.findIndex((item: any) => item.id === id);
    if (index > -1) {
      list[index] = { ...list[index], ...submissionData };
    } else {
      list.unshift(submissionData);
    }
    localStorage.setItem(localKey, JSON.stringify(list));
  } catch (e) {}
};

/**
 * Delete a booking from Supabase
 */
export const removeBooking = async (id: string) => {
  if (!supabase) return;
  try {
    await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    // Also remove from general submissions table
    await removeSubmission(id);
  } catch (err: any) {
    // Ignore remote delete error when offline
  }
};

/**
 * Save generic submissions (Registrations, Contact Us, Property listings, Jobs, Service requests)
 * Strategy: 1) typed mirror table -> 2) submissions -> 3) bookings fallback (bookings always exists)
 * This guarantees remote persistence even when setup.sql has not been fully run.
 */
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

  if (supabase) {
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
    } catch (e: any) {
      // table missing
    }

    // 3. Final fallback — bookings table when not already saved
    if (!remoteSaved) {
      try {
        const fallbackBookingType =
          type === 'booking' && (data?.booking_type === 'hourly' || data?.booking_type === 'supplier')
            ? data.booking_type
            : type;
        const { error: bookingsErr } = await supabase
          .from('bookings')
          .upsert({
            id,
            booking_type: fallbackBookingType,
            status: payload.status,
            details: data,
            created_at: payload.created_at
          }, { onConflict: 'id' });
        if (!bookingsErr) remoteSaved = true;
      } catch (e: any) {
        // Local storage fallback below handles persistence
      }
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
  try {
    await supabase
      .from('submissions')
      .delete()
      .eq('id', id);
  } catch (err: any) {}
  // Also remove bookings fallback row (where saveSubmission stored it)
  try {
    await supabase.from('bookings').delete().eq('id', id);
  } catch (err: any) {}
};

/**
 * Fetch all submissions for the Admin Panel
 * Tries submissions first, falls back to bookings (booking_type not hourly/supplier)
 */
export const fetchAllSubmissions = async (): Promise<any[]> => {
  if (!supabase) return [];
  // 1. Try submissions table (ideal)
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data && data.length) return data;
  } catch (err: any) {
    // table missing
  }
  // 2. Fallback: read from bookings where booking_type is not the two native booking types
  // This is where saveSubmission fallback stores data when submissions is missing.
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      return [];
    }
    // Map bookings rows back to submissions shape
    const filtered = (data || []).filter((r: any) => !['hourly','supplier'].includes(r.booking_type));
    return filtered.map((r: any) => ({
      id: r.id,
      type: r.booking_type,
      status: r.status,
      data: r.details,
      created_at: r.created_at,
    }));
  } catch (err: any) {
    return [];
  }
};
