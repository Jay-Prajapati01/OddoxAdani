import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please create a .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

// Create and export Supabase client
// This client is used throughout the app for auth and database operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Store session in localStorage for persistence across page reloads
    storage: window.localStorage,
    // Automatically refresh the session before it expires
    autoRefreshToken: true,
    // Persist the session across browser tabs
    persistSession: true,
    // Detect when the user comes back to the app
    detectSessionInUrl: true,
  },
});

// Database types for TypeScript
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string | null;
          name: string | null;
          role: string | null;
          avatar_url: string | null;
          company: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          name?: string | null;
          role?: string | null;
          avatar_url?: string | null;
          company?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          name?: string | null;
          role?: string | null;
          avatar_url?: string | null;
          company?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      equipment: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string | null;
          status: string | null;
          serial_number: string | null;
          purchase_date: string | null;
          last_maintenance: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category?: string | null;
          status?: string | null;
          serial_number?: string | null;
          purchase_date?: string | null;
          last_maintenance?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          category?: string | null;
          status?: string | null;
          serial_number?: string | null;
          purchase_date?: string | null;
          last_maintenance?: string | null;
          created_at?: string;
        };
      };
      maintenance_requests: {
        Row: {
          id: string;
          user_id: string;
          equipment_id: string | null;
          subject: string;
          description: string | null;
          type: string | null;
          status: string | null;
          priority: string | null;
          assigned_to: string | null;
          scheduled_date: string | null;
          estimated_hours: number | null;
          actual_hours: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          equipment_id?: string | null;
          subject: string;
          description?: string | null;
          type?: string | null;
          status?: string | null;
          priority?: string | null;
          assigned_to?: string | null;
          scheduled_date?: string | null;
          estimated_hours?: number | null;
          actual_hours?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          equipment_id?: string | null;
          subject?: string;
          description?: string | null;
          type?: string | null;
          status?: string | null;
          priority?: string | null;
          assigned_to?: string | null;
          scheduled_date?: string | null;
          estimated_hours?: number | null;
          actual_hours?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
