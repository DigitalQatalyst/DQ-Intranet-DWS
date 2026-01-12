/**
 * LMS Service for fetching data from Supabase
 * Updated for new schema: learning_paths, courses, modules, lessons, quizzes
 */

import { lmsSupabaseClient } from '../lib/lmsSupabaseClient';
import type {
  LmsCourseRow,
  LmsCourseWithRelations,
  LmsModuleRow,
  LmsModuleWithRelations,
  LmsLessonRow,
  LmsQuizRow,
  LmsLearningPathRow,
} from '../types/lmsSupabase';
import type { LmsDetail, LmsCard } from '../data/lmsCourseDetails';
import { levelLabelFromCode, levelShortLabelFromCode } from '../lms/levels';
import { LOCATION_ALLOW, LevelCode } from '@/lms/config';
import { formatDurationFromMinutes } from '../utils/durationFormatter';

// Helper to normalize level code
function normalizeLevelCode(code: string | null): LevelCode {
  if (!code) return 'L1';

  const trimmed = code.trim();
  if (!trimmed) return 'L1';

  // 1. Try exact match with valid codes
  const LEVEL_CODE_SET = new Set<string>(['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8']);
  const upper = trimmed.toUpperCase() as LevelCode;
  if (LEVEL_CODE_SET.has(upper)) return upper;

  // 2. Try prefix match (e.g., "L0. Starting" or "L0 – Starting")
  const prefixMatch = trimmed.match(/^(L\d)/i);
  if (prefixMatch) {
    const normalized = prefixMatch[1].toUpperCase() as LevelCode;
    if (LEVEL_CODE_SET.has(normalized)) return normalized;
  }

  // 3. Try matching descriptive labels (case-insensitive)
  const lower = trimmed.toLowerCase();
  if (lower.includes('starting') || lower.includes('learning')) return 'L0';
  if (lower.includes('follow') || lower.includes('awareness')) return 'L1';
  if (lower.includes('assist')) return 'L2';
  if (lower.includes('apply')) return 'L3';
  if (lower.includes('enable')) return 'L4';
  if (lower.includes('ensure')) return 'L5';
  if (lower.includes('influence')) return 'L6';
  if (lower.includes('inspire')) return 'L7';

  return 'L1';
}

// Helper to convert status
function normalizeStatus(status: string): 'live' | 'coming-soon' {
  if (status === 'published') return 'live';
  if (status === 'draft') return 'coming-soon';
  return 'live';
}

// Helper to parse department/audience from TEXT to array
function parseTextToArray(text: string | null): string[] {
  if (!text) return [];
  // If it's already an array-like string, parse it
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [text];
  } catch {
    return text.split(',').map(s => s.trim()).filter(Boolean);
  }
}

/**
 * Transform Supabase course row to LmsDetail type
 */
function transformCourseToLmsDetail(
  course: LmsCourseWithRelations
): LmsDetail {
  // Transform modules and lessons into curriculum structure
  const curriculum: LmsDetail['curriculum'] = [];

  if (course.modules && course.modules.length > 0) {
    // Course has modules (Multi-Lessons course)
    curriculum.push(...course.modules.map((module) => {
      const curriculumItem: LmsDetail['curriculum'][0] = {
        id: module.id,
        title: module.title,
        description: module.description || undefined,
        duration: module.duration ? formatDurationFromMinutes(module.duration) : undefined,
        order: module.item_order,
        isLocked: module.is_locked,
      };

      // Add lessons from module
      if (module.lessons && module.lessons.length > 0) {
        curriculumItem.lessons = module.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description || undefined,
          duration: lesson.duration ? formatDurationFromMinutes(lesson.duration) : undefined,
          type: lesson.video_url ? 'video' : (lesson.content ? 'guide' : 'reading') as 'video' | 'guide' | 'quiz' | 'workshop' | 'assignment' | 'reading',
          order: lesson.item_order,
          isLocked: lesson.is_locked,
          videoUrl: lesson.video_url || undefined,
          content: lesson.content || undefined,
        }));
      }

      return curriculumItem;
    }));
  } else if (course.lessons && course.lessons.length > 0) {
    // Course has lessons directly (Single Lesson course)
    curriculum.push({
      id: course.id,
      title: course.title,
      description: course.description || undefined,
      order: 0,
      lessons: course.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description || undefined,
        duration: lesson.duration ? formatDurationFromMinutes(lesson.duration) : undefined,
        type: lesson.video_url ? 'video' : (lesson.content ? 'guide' : 'reading') as 'video' | 'guide' | 'quiz' | 'workshop' | 'assignment' | 'reading',
        order: lesson.item_order,
        isLocked: lesson.is_locked,
        videoUrl: lesson.video_url || undefined,
        content: lesson.content || undefined,
      })),
    });
  }

  // Add Final Assessment if present
  if (course.quiz) {
    curriculum.push({
      id: course.quiz.id,
      title: 'Final Assessment',
      description: course.quiz.description || 'Complete the final assessment to finish the course.',
      order: 9999,
      lessons: [{
        id: course.quiz.id, // Using quiz ID, handled specially in rendering
        title: course.quiz.title,
        description: course.quiz.description || undefined,
        type: 'final-assessment',
        order: 1,
        isLocked: false // Could be based on progress
      }]
    });
  }

  // Parse FAQ from JSONB
  const faq = Array.isArray(course.faq) ? course.faq.map((item: any) => ({
    question: item.question || '',
    answer: item.answer || '',
  })) : undefined;

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    provider: course.provider,
    courseCategory: course.category,
    deliveryMode: (course.delivery_mode === 'online' ? 'Online' : (course.delivery_mode === 'hybrid' ? 'Hybrid' : 'Online')) as 'Video' | 'Guide' | 'Workshop' | 'Hybrid' | 'Online',
    duration: formatDurationFromMinutes(course.duration),
    durationMinutes: course.duration, // Store actual minutes
    levelCode: normalizeLevelCode(course.level_code),
    department: parseTextToArray(course.department),
    locations: ['Riyadh'], // Default location since not in schema
    audience: parseTextToArray(course.audience) as Array<'Associate' | 'Lead'>,
    status: normalizeStatus(course.status),
    summary: course.description || course.title,
    highlights: course.highlights || [],
    outcomes: course.outcomes || [],
    courseType: course.course_type || undefined,
    track: course.track || undefined,
    rating: course.rating > 0 ? course.rating : undefined,
    reviewCount: course.review_count > 0 ? course.review_count : undefined,
    faq,
    imageUrl: course.image_url || undefined,
    curriculum: curriculum.length > 0 ? curriculum : undefined,
  };
}

/**
 * Transform Supabase course row to LmsCard type
 */
function transformCourseToLmsCard(course: LmsCourseRow): LmsCard {
  const levelCode = normalizeLevelCode(course.level_code);
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    provider: course.provider,
    courseCategory: course.category,
    deliveryMode: course.delivery_mode || 'Online',
    duration: formatDurationFromMinutes(course.duration),
    durationMinutes: course.duration, // Store actual minutes
    levelCode,
    levelLabel: levelLabelFromCode(levelCode),
    levelShortLabel: levelShortLabelFromCode(levelCode),
    locations: ['Riyadh'], // Default location
    audience: parseTextToArray(course.audience),
    status: normalizeStatus(course.status),
    summary: course.description || course.title,
    department: parseTextToArray(course.department),
    courseType: course.course_type || undefined,
    track: course.track || undefined,
    imageUrl: course.image_url || undefined,
  };
}

/**
 * Fetch all courses (for listing page)
 */
export async function fetchAllCourses(): Promise<LmsCard[]> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_courses')
    .select('*')
    .eq('status', 'published')
    .order('title');

  if (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }

  return data.map(transformCourseToLmsCard);
}

/**
 * Fetch course by slug (for detail page)
 */
export async function fetchCourseBySlug(slug: string): Promise<LmsDetail | null> {
  // Fetch course
  const { data: course, error: courseError } = await lmsSupabaseClient
    .from('lms_courses')
    .select('*')
    .eq('slug', slug)
    .single();

  if (courseError || !course) {
    console.error('Error fetching course:', courseError);
    return null;
  }

  // Fetch modules for this course
  const { data: modules } = await lmsSupabaseClient
    .from('lms_modules')
    .select('*')
    .eq('course_id', course.id)
    .order('item_order');

  // Fetch lessons for modules
  const modulesWithLessons: LmsModuleWithRelations[] = [];
  for (const module of modules || []) {
    const { data: lessons } = await lmsSupabaseClient
      .from('lms_lessons')
      .select('*')
      .eq('module_id', module.id)
      .order('item_order');

    modulesWithLessons.push({
      ...module,
      lessons: lessons || [],
    });
  }

  // Fetch lessons directly on course (not in modules)
  const { data: directLessons } = await lmsSupabaseClient
    .from('lms_lessons')
    .select('*')
    .eq('course_id', course.id)
    .is('module_id', null)
    .order('item_order');

  const courseWithRelations: LmsCourseWithRelations = {
    ...course,
    modules: modulesWithLessons.length > 0 ? modulesWithLessons : undefined,
    lessons: directLessons && directLessons.length > 0 ? directLessons : undefined,
    quiz: await fetchQuizByCourseId(course.id) // Fetch final assessment
  };

  return transformCourseToLmsDetail(courseWithRelations);
}

/**
 * Fetch courses by filter criteria
 */
export async function fetchCoursesByFilters(filters: {
  category?: string[];
  provider?: string[];
  courseType?: string[];
  location?: string[];
  audience?: string[];
  sfiaRating?: string[];
  searchQuery?: string;
}): Promise<LmsCard[]> {
  let query = lmsSupabaseClient
    .from('lms_courses')
    .select('*')
    .eq('status', 'published');

  // Apply filters
  if (filters.category && filters.category.length > 0) {
    query = query.in('category', filters.category);
  }

  if (filters.provider && filters.provider.length > 0) {
    query = query.in('provider', filters.provider);
  }

  if (filters.courseType && filters.courseType.length > 0) {
    query = query.in('course_type', filters.courseType);
  }

  if (filters.audience && filters.audience.length > 0) {
    // Since audience is TEXT, we need to filter client-side
    // Or use text search if Supabase supports it
  }

  if (filters.sfiaRating && filters.sfiaRating.length > 0) {
    query = query.in('level_code', filters.sfiaRating);
  }

  const { data, error } = await query.order('title');

  if (error) {
    console.error('Error fetching filtered courses:', error);
    throw error;
  }

  let courses = data.map(transformCourseToLmsCard);

  // Apply client-side filters
  if (filters.audience && filters.audience.length > 0) {
    courses = courses.filter(course =>
      course.audience.some(aud => filters.audience!.includes(aud))
    );
  }

  // Apply search query filter (client-side for text search)
  if (filters.searchQuery) {
    const searchLower = filters.searchQuery.toLowerCase();
    courses = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchLower) ||
        course.summary.toLowerCase().includes(searchLower) ||
        course.provider.toLowerCase().includes(searchLower)
    );
  }

  return courses;
}

/**
 * Fetch all reviews (for reviews tab)
 * Note: Reviews are no longer in separate table, return empty array
 */
export async function fetchAllReviews(): Promise<
  Array<{
    id: string;
    author: string;
    role: string;
    text: string;
    rating: number;
    courseId: string;
    courseSlug: string;
    courseTitle: string;
    courseType?: string;
    provider?: string;
    audience?: string[];
  }>
> {
  // Reviews are now stored in course.faq or testimonials JSONB
  // Return empty array for now - can be extended later
  return [];
}

/**
 * Create a new review
 * Note: Reviews are no longer in separate table
 */
export async function createReview(
  courseId: string,
  review: {
    author: string;
    role: string;
    text: string;
    rating: number;
  }
): Promise<any> {
  // Reviews are now stored in course JSONB fields
  // This would need to update the course record
  throw new Error('Review creation not implemented - reviews are stored in course JSONB');
}

/**
 * Fetch quiz for a lesson
 */
export async function fetchQuizByLessonId(lessonId: string): Promise<LmsQuizRow | null> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_quizzes')
    .select('*')
    .eq('lesson_id', lessonId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No quiz found for this lesson
      return null;
    }
    console.error('Error fetching quiz:', error);
    throw error;
  }

  return data;
}

/**
 * Fetch quiz for a course
 */
export async function fetchQuizByCourseId(courseId: string): Promise<LmsQuizRow | null> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_quizzes')
    .select('*')
    .eq('course_id', courseId)
    .is('lesson_id', null)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No quiz found for this course
      return null;
    }
    console.error('Error fetching quiz:', error);
    throw error;
  }

  return data;
}

/**
 * Fetch all learning paths
 */
export async function fetchAllLearningPaths(): Promise<LmsCard[]> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_learning_paths')
    .select('*')
    .eq('status', 'published')
    .order('title');

  if (error) {
    console.error('Error fetching learning paths:', error);
    throw error;
  }

  return data.map((path) => ({
    id: path.id,
    slug: path.slug,
    title: path.title,
    provider: path.provider,
    courseCategory: path.category,
    deliveryMode: 'Online' as const,
    duration: formatDurationFromMinutes(path.duration),
    durationMinutes: path.duration,
    levelCode: normalizeLevelCode(path.level_code),
    levelLabel: levelLabelFromCode(normalizeLevelCode(path.level_code)),
    levelShortLabel: levelShortLabelFromCode(normalizeLevelCode(path.level_code)),
    locations: ['Riyadh'],
    audience: parseTextToArray(path.audience),
    status: normalizeStatus(path.status),
    summary: path.description || path.title,
    department: parseTextToArray(path.department),
    courseType: undefined,
    track: undefined,
    imageUrl: path.image_url || undefined,
    rating: path.rating > 0 ? path.rating : undefined,
    reviewCount: path.review_count > 0 ? path.review_count : undefined,
  }));
}

/**
 * Fetch learning path by slug with courses
 */
export async function fetchLearningPathBySlug(slug: string): Promise<LmsDetail | null> {
  // Fetch learning path
  const { data: path, error: pathError } = await lmsSupabaseClient
    .from('lms_learning_paths')
    .select('*')
    .eq('slug', slug)
    .single();

  if (pathError || !path) {
    console.error('Error fetching learning path:', pathError);
    return null;
  }

  // Fetch path items (courses in this path)
  const { data: pathItems } = await lmsSupabaseClient
    .from('lms_path_items')
    .select('*')
    .eq('path_id', path.id)
    .order('position');

  // Fetch course details for each course in the path
  const courseIds = pathItems?.map(item => item.course_id) || [];
  const courses: LmsCourseRow[] = [];

  if (courseIds.length > 0) {
    const { data: pathCourses } = await lmsSupabaseClient
      .from('lms_courses')
      .select('*')
      .in('id', courseIds);

    if (pathCourses) {
      // Sort courses by their position in the path
      const coursesMap = new Map(pathCourses.map(c => [c.id, c]));
      courses.push(...courseIds.map(id => coursesMap.get(id)).filter(Boolean) as LmsCourseRow[]);
    }
  }

  // Build curriculum structure from courses
  const curriculum = courses.map((course, index) => ({
    id: course.id,
    title: course.title,
    description: course.description || undefined,
    duration: formatDurationFromMinutes(course.duration),
    order: index,
    courseSlug: course.slug,
  }));

  // Parse FAQ from JSONB
  const faq = Array.isArray(path.faq) ? path.faq.map((item: any) => ({
    question: item.question || '',
    answer: item.answer || '',
  })) : undefined;

  return {
    id: path.id,
    slug: path.slug,
    title: path.title,
    provider: path.provider,
    courseCategory: path.category,
    deliveryMode: 'Online',
    duration: formatDurationFromMinutes(path.duration),
    durationMinutes: path.duration,
    levelCode: normalizeLevelCode(path.level_code),
    department: parseTextToArray(path.department),
    locations: ['Riyadh'],
    audience: parseTextToArray(path.audience) as Array<'Associate' | 'Lead'>,
    status: normalizeStatus(path.status),
    summary: path.description || path.title,
    highlights: path.highlights || [],
    outcomes: path.outcomes || [],
    courseType: 'Course (Bundles)' as const,
    track: undefined,
    rating: path.rating > 0 ? path.rating : undefined,
    reviewCount: path.review_count > 0 ? path.review_count : undefined,
    faq,
    imageUrl: path.image_url || undefined,
    curriculum: curriculum.length > 0 ? curriculum : undefined,
  };
}

/**
 * Find learning paths that contain a specific course
 */
export async function findLearningPathsForCourse(courseId: string): Promise<Array<{
  pathId: string;
  pathSlug: string;
  pathTitle: string;
  position: number;
}>> {
  const { data: pathItems, error } = await lmsSupabaseClient
    .from('lms_path_items')
    .select(`
      path_id,
      position,
      lms_learning_paths!inner (
        id,
        slug,
        title
      )
    `)
    .eq('course_id', courseId)
    .order('position');

  if (error) {
    console.error('Error finding learning paths for course:', error);
    return [];
  }

  return (pathItems || []).map((item: any) => ({
    pathId: item.path_id,
    pathSlug: item.lms_learning_paths?.slug || '',
    pathTitle: item.lms_learning_paths?.title || '',
    position: item.position,
  }));
}

/**
 * Fetch all courses in a learning path (for displaying "Part of Track" section)
 */
export async function fetchCoursesInLearningPath(pathId: string): Promise<Array<{
  id: string;
  slug: string;
  title: string;
  position: number;
}>> {
  const { data: pathItems, error } = await lmsSupabaseClient
    .from('lms_path_items')
    .select(`
      course_id,
      position,
      lms_courses!inner (
        id,
        slug,
        title
      )
    `)
    .eq('path_id', pathId)
    .order('position');

  if (error) {
    console.error('Error fetching courses in learning path:', error);
    return [];
  }

  return (pathItems || []).map((item: any) => ({
    id: item.lms_courses?.id || '',
    slug: item.lms_courses?.slug || '',
    title: item.lms_courses?.title || '',
    position: item.position,
  }));
}
