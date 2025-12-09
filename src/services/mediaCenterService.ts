import { mediaSupabaseClient } from '@/lib/mediaSupabaseClient'
import type { NewsItem } from '@/data/media/news'
import type { JobItem } from '@/data/media/jobs'

export async function fetchAllNews(): Promise<NewsItem[]> {
  try {
    const { data, error } = await mediaSupabaseClient
      .from('news')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching news from Supabase:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      // Provide helpful error messages for common errors
      if (error.code === 'PGRST301' || error.message?.includes('401') || error.message?.includes('JWT')) {
        console.error('🔐 Authentication Error: Check your Supabase environment variables and RLS policies.')
        console.error('📖 See SUPABASE_401_ERROR_FIX.md for troubleshooting steps.')
      } else if (error.code === '42501' || error.message?.includes('permission denied')) {
        console.error('🚫 Permission Error (42501): The anon role needs GRANT permissions on the news/jobs tables.')
        console.error('📖 See QUICK_FIX_42501.md for the quick fix (takes 2 minutes).')
        console.error('💡 Run this SQL in Supabase SQL Editor:')
        console.error('   GRANT SELECT ON public.news TO anon;')
        console.error('   GRANT SELECT ON public.jobs TO anon;')
      }
      
      throw error
    }

    return (data ?? []) as NewsItem[]
  } catch (err) {
    console.error('Failed to fetch news from Supabase:', err)
    throw err
  }
}

export async function fetchAllJobs(): Promise<JobItem[]> {
  try {
    const { data, error } = await mediaSupabaseClient
      .from('jobs')
      .select('*')
      .order('postedOn', { ascending: false })

    if (error) {
      console.error('Error fetching jobs from Supabase:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      // Provide helpful error messages for common errors
      if (error.code === 'PGRST301' || error.message?.includes('401') || error.message?.includes('JWT')) {
        console.error('🔐 Authentication Error: Check your Supabase environment variables and RLS policies.')
        console.error('📖 See SUPABASE_401_ERROR_FIX.md for troubleshooting steps.')
      } else if (error.code === '42501' || error.message?.includes('permission denied')) {
        console.error('🚫 Permission Error (42501): The anon role needs GRANT permissions on the news/jobs tables.')
        console.error('📖 See QUICK_FIX_42501.md for the quick fix (takes 2 minutes).')
        console.error('💡 Run this SQL in Supabase SQL Editor:')
        console.error('   GRANT SELECT ON public.news TO anon;')
        console.error('   GRANT SELECT ON public.jobs TO anon;')
      }
      
      throw error
    }

    return (data ?? []) as JobItem[]
  } catch (err) {
    console.error('Failed to fetch jobs from Supabase:', err)
    throw err
  }
}

export async function fetchNewsById(id: string): Promise<NewsItem | null> {
  const { data, error } = await mediaSupabaseClient
    .from('news')
    .select('*')
    .eq('id', id)
    .limit(1)

  if (error) {
    console.error('Error fetching news item from Supabase', error)
    return null
  }

  const row = data && data[0]
  return row ? (row as NewsItem) : null
}

export async function fetchJobById(id: string): Promise<JobItem | null> {
  const { data, error } = await mediaSupabaseClient
    .from('jobs')
    .select('*')
    .eq('id', id)
    .limit(1)

  if (error) {
    console.error('Error fetching job from Supabase', error)
    return null
  }

  const row = data && data[0]
  return row ? (row as JobItem) : null
}
