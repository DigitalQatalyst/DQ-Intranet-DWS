<<<<<<< HEAD
import { createClient } from '@supabase/supabase-js'

// Vite injects these at build time. They must be defined.
const url = import.meta.env.VITE_SUPABASE_URL as string
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string
=======
import { createClient } from '@supabase/supabase-js';

// Support both REACT_APP_ and VITE_ prefixes (prioritize REACT_APP_)
const url = (import.meta.env.REACT_APP_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL) as string | undefined;
const anon = (import.meta.env.REACT_APP_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined;
>>>>>>> origin/Develop

if (!url || !anon) {
  // Helps you catch misconfigured envs early during dev
  // eslint-disable-next-line no-console
<<<<<<< HEAD
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check your .env and restart the dev server.')
  throw new Error('Supabase env vars not set')
=======
  console.error('Missing REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_ANON_KEY. Check your .env and restart the dev server.');
  console.error('Available env vars:', {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    REACT_APP_SUPABASE_URL: import.meta.env.REACT_APP_SUPABASE_URL,
    url: url ? 'present' : 'missing',
    anon: anon ? 'present' : 'missing',
  });
  throw new Error('Supabase env vars not set. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
>>>>>>> origin/Develop
}

export const supabaseClient = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
});

// Debug: Verify client is initialized (remove after confirming fix works)
if (typeof window !== 'undefined') {
  console.log('✅ supabaseClient initialized:', !!supabaseClient)
}

// Backwards compatibility: also export as 'supabase'
<<<<<<< HEAD
export const supabase = supabaseClient
export default supabaseClient
=======
export const supabase = supabaseClient;
export default supabaseClient;
>>>>>>> origin/Develop
