import { createClient } from '@supabase/supabase-js'

const url = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL) as string | undefined
const anon = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined

if (!url || !anon) {
  console.error('Supabase URL or VITE_SUPABASE_PUBLISHABLE_KEY is missing for media center. Check your .env file.')
  throw new Error('Supabase environment not configured')
}

export const mediaSupabaseClient = createClient(url, anon, {
  auth: {
    storageKey: 'supabase-auth-media',
    persistSession: true,
    autoRefreshToken: true
  }
})
