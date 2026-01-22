import { createClient } from '@supabase/supabase-js';

// Mengambil kunci rahasia dari environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Pengecekan keamanan sederhana
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL atau Key belum disetting di .env.local');
}

// Membuat client untuk digunakan di seluruh aplikasi
export const supabase = createClient(supabaseUrl, supabaseKey);