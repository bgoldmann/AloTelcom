import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check for environment variables and provide helpful error messages
if (!supabaseUrl || !supabaseAnonKey) {
  const missing = [];
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY');
  
  console.error('Missing Supabase environment variables:', missing.join(', '));
  console.error('Please set these in your .env.local file or Vercel environment variables.');
  console.error('Get your credentials from: https://supabase.com/dashboard/project/_/settings/api');
  
  // Don't throw immediately - allow the app to load and show a helpful error
  // The error will be caught when trying to use Supabase
}

// Create client - always create a client, but it will fail gracefully if env vars are missing
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: !!supabaseUrl && !!supabaseAnonKey,
      persistSession: !!supabaseUrl && !!supabaseAnonKey,
      detectSessionInUrl: !!supabaseUrl && !!supabaseAnonKey
    }
  }
);

// Log environment variable status
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables are missing!');
  console.error('Required variables:', {
    VITE_SUPABASE_URL: supabaseUrl ? '✅ Set' : '❌ MISSING',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? '✅ Set' : '❌ MISSING'
  });
  console.error('Please set these in your .env.local file (local) or Vercel environment variables (production)');
} else {
  console.log('✅ Supabase environment variables are set');
}

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Helper function to get session
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

