import type { NewsItem } from '@/data/media/news'
import type { JobItem } from '@/data/media/jobs'
import { NEWS } from '@/data/media/news'
import { JOBS } from '@/data/media/jobs'

// Temporarily exclude specific legacy announcements from UI listings
const EXCLUDED_NEWS_IDS: string[] = [
  'dq-dxb-ksa-christmas-new-year-schedule',
  'dq-nbo-christmas-new-year-schedule'
]

/**
 * Fetch all news items from local data
 * Returns news sorted by date (newest first)
 */
export async function fetchAllNews(): Promise<NewsItem[]> {
  // Return local data sorted by date (newest first)
  return [...NEWS]
    .filter(item => !EXCLUDED_NEWS_IDS.includes(item.id))
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })
}

/**
 * Fetch all job items from local data
 * Returns jobs sorted by posted date (newest first)
 */
export async function fetchAllJobs(): Promise<JobItem[]> {
  // Return local data sorted by posted date (newest first)
  return [...JOBS].sort((a, b) => {
    const dateA = new Date(a.postedOn).getTime()
    const dateB = new Date(b.postedOn).getTime()
    return dateB - dateA
  })
}

/**
 * Fetch a single news item by ID from local data
 */
export async function fetchNewsById(id: string): Promise<NewsItem | null> {
  return NEWS.find(item => item.id === id) || null
}

/**
 * Fetch a single job item by ID from local data
 */
export async function fetchJobById(id: string): Promise<JobItem | null> {
  return JOBS.find(item => item.id === id) || null
}
