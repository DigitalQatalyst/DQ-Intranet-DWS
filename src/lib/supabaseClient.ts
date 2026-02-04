import { createClient } from '@supabase/supabase-js'

// Vite injects these at build time. They must be defined.
const url = import.meta.env.VITE_SUPABASE_URL as string

// Prefer VITE_SUPABASE_ANON_KEY, but fall back to VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
const anon =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string | undefined) ||
  ''

if (!url || !anon) {
  // Helps you catch misconfigured envs early during dev
  // eslint-disable-next-line no-console
  console.error(
    'Missing Supabase env vars. Expected VITE_SUPABASE_URL and either VITE_SUPABASE_ANON_KEY or VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY. Check your .env and restart the dev server.'
  )
  throw new Error('Supabase env vars not set')
}

export const supabaseClient = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
})

// Debug: Verify client is initialized (remove after confirming fix works)
if (typeof window !== 'undefined') {
  console.log('✅ supabaseClient initialized:', !!supabaseClient)
}

// Backwards compatibility: also export as 'supabase'
export const supabase = supabaseClient
export default supabaseClient
