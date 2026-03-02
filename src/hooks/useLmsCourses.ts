/**
 * React hooks for fetching LMS courses from Supabase
 */

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  getLmsCourses,
  getLmsCourseDetails,
} from '../data/lmsCourseDetails';
import {
  fetchAllReviews,
  createReview,
} from '../services/lmsService';
import type { LmsCard, LmsDetail } from '../data/lmsCourseDetails';

/**
 * Hook to fetch all courses
 */
export function useLmsCourses() {
  return useQuery<LmsCard[], Error>({
    queryKey: ['lms', 'courses'],
    queryFn: getLmsCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch all course details
 */
export function useLmsCourseDetails() {
  return useQuery<LmsDetail[], Error>({
    queryKey: ['lms', 'course-details'],
    queryFn: getLmsCourseDetails,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single course by slug
 */
export function useLmsCourse(slug: string) {
  return useQuery<LmsDetail | null, Error>({
    queryKey: ['lms', 'courses', slug],
    queryFn: async () => {
      const searchSlug = slug.trim();
      const courses = await getLmsCourseDetails();
      return (
        courses.find(c => c.slug === searchSlug) ??
        courses.find(c => c.slug.toLowerCase() === searchSlug.toLowerCase()) ??
        null
      );
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

type LmsCourseFilters = {
  category?: string[];
  provider?: string[];
  courseType?: string[];
  location?: string[];
  audience?: string[];
  sfiaRating?: string[];
  searchQuery?: string;
};

function applyLmsCourseFilters(courses: LmsCard[], filters: LmsCourseFilters): LmsCard[] {
  return courses
    .filter(c => !filters.category?.length || filters.category.includes(c.courseCategory))
    .filter(c => !filters.provider?.length || filters.provider.includes(c.provider))
    .filter(c => !filters.courseType?.length || (!!c.courseType && filters.courseType.includes(c.courseType)))
    .filter(c => !filters.location?.length || c.locations.some(loc => filters.location!.includes(loc)))
    .filter(c => !filters.audience?.length || c.audience.some(aud => filters.audience!.includes(aud)))
    .filter(c => !filters.sfiaRating?.length || filters.sfiaRating.includes(c.levelCode))
    .filter(c => {
      if (!filters.searchQuery) return true;
      const q = filters.searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.provider.toLowerCase().includes(q)
      );
    });
}

/**
 * Hook to fetch filtered courses
 */
export function useLmsCoursesFiltered(filters: LmsCourseFilters) {
  return useQuery<LmsCard[], Error>({
    queryKey: ['lms', 'courses', 'filtered', filters],
    queryFn: async () => applyLmsCourseFilters(await getLmsCourses(), filters),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch all reviews
 */
export function useLmsReviews() {
  return useQuery<
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
    }>,
    Error
  >({
    queryKey: ['lms', 'reviews'],
    queryFn: fetchAllReviews,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a review
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      review,
    }: {
      courseId: string;
      review: {
        author: string;
        role: string;
        text: string;
        rating: number;
      };
    }) => createReview(courseId, review),
    onSuccess: (data, variables) => {
      // Invalidate and refetch course data
      queryClient.invalidateQueries({ queryKey: ['lms', 'courses', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['lms', 'reviews'] });
    },
  });
}

