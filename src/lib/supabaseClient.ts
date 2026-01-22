import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/communities/integrations/supabase/types';

// Support both REACT_APP_ and VITE_ prefixes (prioritize VITE_ for consistency with your project)
const url = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.REACT_APP_SUPABASE_URL) as string;
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.REACT_APP_SUPABASE_ANON_KEY) as string;

if (!url || !anon) {
  // Helps you catch misconfigured envs early during dev
  // eslint-disable-next-line no-console
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check your .env and restart the dev server.');
  console.error('Available env vars:', {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    REACT_APP_SUPABASE_URL: import.meta.env.REACT_APP_SUPABASE_URL,
    url: url ? 'present' : 'missing',
    anon: anon ? 'present' : 'missing',
  });
  throw new Error('Supabase env vars not set. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

// Create typed Supabase client with authentication support
export const supabaseClient = createClient<Database>(url, anon, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
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
});

// Debug: Verify client is initialized (remove after confirming fix works)
if (typeof window !== 'undefined') {
  console.log('✅ supabaseClient initialized:', !!supabaseClient);
}

// Backwards compatibility: also export as 'supabase'
export const supabase = supabaseClient;
export default supabaseClient;
