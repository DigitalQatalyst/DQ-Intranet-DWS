/**
 * React hooks for fetching LMS courses from Supabase
 */

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  fetchAllCourses,
  fetchCourseBySlug,
  fetchCoursesByFilters,
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
    queryFn: fetchAllCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single course by slug
 */
export function useLmsCourse(slug: string) {
  return useQuery<LmsDetail | null, Error>({
    queryKey: ['lms', 'courses', slug],
    queryFn: () => fetchCourseBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch filtered courses
 */
export function useLmsCoursesFiltered(filters: {
  category?: string[];
  provider?: string[];
  courseType?: string[];
  location?: string[];
  audience?: string[];
  sfiaRating?: string[];
  searchQuery?: string;
}) {
  return useQuery<LmsCard[], Error>({
    queryKey: ['lms', 'courses', 'filtered', filters],
    queryFn: () => fetchCoursesByFilters(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
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

