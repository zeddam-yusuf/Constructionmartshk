import { createClient } from '@supabase/supabase-js';

// Read from environment variables, fallback to user's provided credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://zcagvktgitwmrccikgas.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_swhL5N6SWjiiP1xchzdV_A_bCCCIbvB';

// Create a single supabase client for the app
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch bookings error:', error.message);
      return [];
    }
    return data || [];
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
 */
export const saveSubmission = async (type: string, data: any) => {
  try {
    const id = data.id || Date.now().toString();
    const payload = {
      id,
      type,
      status: data.status || 'Pending',
      data: data,
      created_at: new Date().toISOString()
    };

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
            ...data,
            created_at: payload.created_at
          }, { onConflict: 'id' });
        
        if (specificErr) {
          console.warn(`Supabase specific table "${specificTable}" upsert warning:`, specificErr.message);
        }
      } catch (e: any) {
        // Table might not exist, proceed to general submissions
      }
    }

    // 2. Write to the general submissions table
    const { error } = await supabase
      .from('submissions')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase generic submissions upsert warning:', error.message);
    }

    // Save locally to ensure persistent rendering in case of database access issues
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

  } catch (err: any) {
    console.error('Failed to save submission to Supabase:', err?.message || err);
  }
};

/**
 * Remove general submission
 */
export const removeSubmission = async (id: string) => {
  try {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Supabase submissions delete warning:', error.message);
    }
  } catch (err: any) {
    console.error('Failed to remove submission:', err?.message || err);
  }
};

/**
 * Fetch all submissions for the Admin Panel
 */
export const fetchAllSubmissions = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch submissions warning:', error.message);
      return [];
    }
    return data || [];
  } catch (err: any) {
    console.error('Failed to fetch submissions:', err?.message || err);
    return [];
  }
};
