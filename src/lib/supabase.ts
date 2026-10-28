import { createClient } from "@supabase/supabase-js";

// Retrieve URL and Key from Vite environment variables or fallback to the provided keys
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "https://vvsncfjlwturdqgjithr.supabase.co";
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2c25jZmpsd3R1cmRxZ2ppdGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4Mjc5NTYsImV4cCI6MjA5OTQwMzk1Nn0.Gfy36RW76xc4t2ThhjJ9Dy4yS4iBoJIpvItJGlraCDg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseProfile {
  id: string;
  full_name: string | null;
  city: string | null;
  avatar_url: string | null;
  updated_at: string;
}

export interface SupabaseBooking {
  id?: number;
  user_id: string;
  experience_title: string;
  subcategory: string;
  spot: string;
  created_at?: string;
}

export interface SupabaseInvitation {
  id?: number;
  user_id: string;
  region: string;
  goal: string;
  interest: string;
  companion_vibe: string;
  created_at?: string;
}

export interface SupabaseLead {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  city: string;
  interests: string;
  join_as: 'partner' | 'seeker';
  lead_type: 'partner' | 'waitlist' | 'early_access';
  created_at?: string;
}

/**
 * Fetch or create profile for an authenticated user
 */
export async function getProfile(userId: string): Promise<SupabaseProfile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("Supabase profiles table query error. Profiles table may not be created yet.", error);
      return null;
    }

    if (!data) {
      // Profile doesn't exist, create default one
      const defaultProfile: Omit<SupabaseProfile, 'updated_at'> = {
        id: userId,
        full_name: "Happy Wanderer",
        city: "Delhi",
        avatar_url: null,
      };
      
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert([defaultProfile])
        .select()
        .single();
        
      if (insertError) {
        console.error("Failed to insert default profile", insertError);
        return null;
      }
      return newProfile;
    }

    return data;
  } catch (err) {
    console.error("Error in getProfile:", err);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateProfile(profile: Partial<SupabaseProfile> & { id: string }): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("profiles")
      .upsert({
        ...profile,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error updating profile in database", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Unexpected error in updateProfile:", err);
    return false;
  }
}

/**
 * Save booking to database
 */
export async function saveBooking(booking: Omit<SupabaseBooking, 'created_at'>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("bookings")
      .insert([booking]);

    if (error) {
      console.warn("Bookings table error. Table might be missing.", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Unexpected error in saveBooking:", err);
    return false;
  }
}

/**
 * Fetch bookings for current user
 */
export async function getBookings(userId: string): Promise<SupabaseBooking[]> {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Failed to fetch bookings. Bookings table might be missing.", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Unexpected error in getBookings:", err);
    return [];
  }
}

/**
 * Save custom built invitation ticket
 */
export async function saveInvitation(invitation: Omit<SupabaseInvitation, 'created_at'>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("invitations")
      .insert([invitation]);

    if (error) {
      console.warn("Invitations table error. Table might be missing.", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Unexpected error in saveInvitation:", err);
    return false;
  }
}

/**
 * Fetch custom built invitations for current user
 */
export async function getInvitations(userId: string): Promise<SupabaseInvitation[]> {
  try {
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Failed to fetch invitations. Invitations table might be missing.", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Unexpected error in getInvitations:", err);
    return [];
  }
}

/**
 * Save collected lead to database
 */
export async function saveLead(lead: Omit<SupabaseLead, 'created_at'>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("leads")
      .insert([lead]);

    if (error) {
      console.warn("Leads table error or missing table.", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Unexpected error in saveLead:", err);
    return false;
  }
}

/**
 * Upload Avatar to public storage bucket
 */
export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  try {
    // We name the file specifically to overwrite or create a fresh path for user
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.warn("Avatar upload failed. Bucket 'avatars' might not exist or be public.", uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return data?.publicUrl || null;
  } catch (err) {
    console.error("Unexpected error in uploadAvatar:", err);
    return null;
  }
}

/**
 * SQL snippet helper to display for setup reference
 */
export const SQL_SETUP_SNIPPET = `-- Paste this SQL into your Supabase SQL Editor to set up tables and RLS:

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  city TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Safely recreate policies to prevent duplicate errors
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
CREATE POLICY "Allow public read access to profiles" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow individual insert of profiles" ON public.profiles;
CREATE POLICY "Allow individual insert of profiles" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Allow individual update of profiles" ON public.profiles;
CREATE POLICY "Allow individual update of profiles" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  experience_title TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  spot TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow individual select of bookings" ON public.bookings;
CREATE POLICY "Allow individual select of bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow individual insert of bookings" ON public.bookings;
CREATE POLICY "Allow individual insert of bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Invitations Table
CREATE TABLE IF NOT EXISTS public.invitations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  region TEXT NOT NULL,
  goal TEXT NOT NULL,
  interest TEXT NOT NULL,
  companion_vibe TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow individual select of invitations" ON public.invitations;
CREATE POLICY "Allow individual select of invitations" ON public.invitations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow individual insert of invitations" ON public.invitations;
CREATE POLICY "Allow individual insert of invitations" ON public.invitations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Storage Bucket Setup
-- Please go to 'Storage' in Supabase dashboard, create a public bucket named "avatars".

-- 5. Leads Table (For pre-auth lead collection)
CREATE TABLE IF NOT EXISTS public.leads (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT NOT NULL,
  interests TEXT NOT NULL,
  join_as TEXT NOT NULL, -- 'partner' or 'seeker'
  lead_type TEXT NOT NULL, -- 'partner' or 'waitlist' or 'early_access'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow public to insert leads so they can submit waitlist/partner forms without auth
DROP POLICY IF EXISTS "Allow public insert of leads" ON public.leads;
CREATE POLICY "Allow public insert of leads" ON public.leads
  FOR INSERT WITH CHECK (true);

-- Allow public read of leads (or restrict to service role if preferred)
DROP POLICY IF EXISTS "Allow public select of leads" ON public.leads;
CREATE POLICY "Allow public select of leads" ON public.leads
  FOR SELECT USING (true);
`;
