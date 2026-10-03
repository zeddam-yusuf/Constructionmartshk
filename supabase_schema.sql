-- Construction Mart SHK - Supabase PostgreSQL Database Setup Script
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/<your-project-id>/sql)

-- 1. Bookings Table (Hourly Labour Bookings, Material Supplier Bookings, and Live Registrations)
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    booking_type TEXT NOT NULL DEFAULT 'hourly',
    status TEXT NOT NULL DEFAULT 'Pending',
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access for demonstration & marketplace workflow
CREATE POLICY "Allow public read access on bookings" ON public.bookings
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update access on bookings" ON public.bookings
    FOR ALL USING (true);

-- 2. Dedicated Registrations Table
CREATE TABLE IF NOT EXISTS public.registrations (
    id TEXT PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    mobile TEXT,
    city TEXT,
    role TEXT,
    category TEXT,
    experience TEXT,
    charges TEXT,
    company_name TEXT,
    gst_number TEXT,
    status TEXT DEFAULT 'Pending Approval',
    data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on registrations" ON public.registrations
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update access on registrations" ON public.registrations
    FOR ALL USING (true);

-- 3. General Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    data JSONB DEFAULT '{}'::jsonb,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on submissions" ON public.submissions
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update access on submissions" ON public.submissions
    FOR ALL USING (true);
