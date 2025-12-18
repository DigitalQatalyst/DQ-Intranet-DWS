import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/communities/integrations/supabase/types'

// Vite injects these at build time. They must be defined

const url = (window as any)._env_?.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL
const anon = (window as any)._env_?.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY
const redirectUrl = (window as any)._env_?.VITE_SUPABASE_REDIRECT_URL || import.meta.env.VITE_SUPABASE_REDIRECT_URL
const siteUrl = (window as any)._env_?.VITE_SUPABASE_SITE_URL || import.meta.env.VITE_SUPABASE_SITE_URL

if (!url || !anon) {
  console.error('Missing Supabase environment variables')
  console.error('VITE_SUPABASE_URL:', url)
  console.error('VITE_SUPABASE_ANON_KEY:', anon ? 'exists' : 'missing')
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}


// Create typed Supabase client for Communities feature
export const supabaseClient = createClient<Database>(url, anon, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    redirectTo: redirectUrl || (typeof window !== 'undefined' ? window.location.origin + '/auth/callback' : undefined),
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-client-info': 'dq-intranet-dws-communities',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Export site URL for use in auth flows
export const supabaseSiteUrl = siteUrl || (typeof window !== 'undefined' ? window.location.origin : '')

// Export as 'supabase' for backward compatibility with community imports
export const supabase = supabaseClient
export default supabaseClient
