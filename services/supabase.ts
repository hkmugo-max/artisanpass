import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallbacks for demo purposes
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyz.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
