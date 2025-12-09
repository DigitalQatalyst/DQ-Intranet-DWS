import { createClient } from '@supabase/supabase-js'

const url = (import.meta.env.REACT_APP_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL) as string | undefined
const anon = (import.meta.env.REACT_APP_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined

if (!url || !anon) {
  const errorMessage = `
❌ Supabase environment variables are missing for media center.

Required variables:
  - VITE_SUPABASE_URL or REACT_APP_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY or REACT_APP_SUPABASE_ANON_KEY

Current values:
  - URL: ${url ? '✅ Set' : '❌ Missing'}
  - Anon Key: ${anon ? '✅ Set' : '❌ Missing'}

📖 See SUPABASE_401_ERROR_FIX.md for setup instructions.
  `.trim()
  
  console.error(errorMessage)
  throw new Error('Supabase environment not configured')
}

// Log configuration status (only URL, not the key for security)
console.log('✅ Supabase Media Center client configured:', {
  url: url.substring(0, 30) + '...',
  hasAnonKey: !!anon
})

export const mediaSupabaseClient = createClient(url, anon)
