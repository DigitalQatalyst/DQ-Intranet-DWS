import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    BookOpen,
    CheckCircle2,
    Clock,
    Award,
    TrendingUp,
    FileText,
    ChevronRight,
    Target,
    X,
} from 'lucide-react';
import { useLmsCourseDetails } from '../../hooks/useLmsCourses';
import type { LmsDetail } from '../../data/lmsCourseDetails';
import { PageSection, PageLayout } from '../../components/PageLayout';

// Storage keys
const COMPLETION_STORAGE_PREFIX = 'lms_lesson_completed_';
const QUIZ_STORAGE_PREFIX = 'lms_quiz_submission_';
const COURSE_STARTED_PREFIX = 'lms_course_started_';

// Helper functions
function isLessonCompleted(lessonId: string): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`${COMPLETION_STORAGE_PREFIX}${lessonId}`) === 'true';
}

function getQuizSubmissions(): Array<{
    quizId: string;
    lessonId: string;
    courseId: string;
    score: number;
    totalQuestions: number;
    submittedAt: string;
    passed?: boolean;
}> {
    if (typeof window === 'undefined') return [];
    const submissions: Array<{
        quizId: string;
        lessonId: string;
        courseId: string;
        score: number;
        totalQuestions: number;
        submittedAt: string;
        passed?: boolean;
    }> = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(QUIZ_STORAGE_PREFIX)) {
            try {
                const data = JSON.parse(localStorage.getItem(key) || '{}');
                submissions.push(data);
            } catch (e) {
                // Skip invalid entries
            }
        }
    }

    return submissions.sort((a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
}

function getStartedCourses(): string[] {
    if (typeof window === 'undefined') return [];
    const courses: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(COURSE_STARTED_PREFIX)) {
            const courseSlug = key.replace(COURSE_STARTED_PREFIX, '');
            if (localStorage.getItem(key) === 'true') {
                courses.push(courseSlug);
            }
        }
    }
    return courses;
}

function getAllLessonIds(course: LmsDetail): string[] {
    const lessonIds: string[] = [];
    course.curriculum?.forEach((item) => {
        if (item.lessons) {
            item.lessons.forEach((lesson) => {
                lessonIds.push(lesson.id);
            });
        }
        if (item.topics) {
            item.topics.forEach((topic) => {
                if (topic.lessons) {
                    topic.lessons.forEach((lesson) => {
                        lessonIds.push(lesson.id);
                    });
                }
            });
        }
    });
    return lessonIds;
}

function calculateCourseProgress(course: LmsDetail): number {
    const lessonIds = getAllLessonIds(course);
    if (lessonIds.length === 0) return 0;
    const completedCount = lessonIds.filter(id => isLessonCompleted(id)).length;
    return Math.round((completedCount / lessonIds.length) * 100);
}

export const LearningPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'courses' | 'quizzes'>('courses');
    const { data: allCourses } = useLmsCourseDetails();
    const quizSubmissions = useMemo(() => getQuizSubmissions(), []);
    const startedCourseSlugs = useMemo(() => getStartedCourses(), []);

    // Get courses that user has started
    const startedCourses = useMemo(() => {
        if (!allCourses) return [];
        return allCourses.filter(course => startedCourseSlugs.includes(course.slug));
    }, [allCourses, startedCourseSlugs]);

    // Calculate statistics
    const stats = useMemo(() => {
        const totalLessons = startedCourses.reduce((sum, course) => {
            return sum + getAllLessonIds(course).length;
        }, 0);

        const completedLessons = startedCourses.reduce((sum, course) => {
            const lessonIds = getAllLessonIds(course);
            return sum + lessonIds.filter(id => isLessonCompleted(id)).length;
        }, 0);

        const totalQuizzes = quizSubmissions.length;
        const averageQuizScore = quizSubmissions.length > 0
            ? Math.round(
                quizSubmissions.reduce((sum, q) => sum + (q.score / q.totalQuestions) * 100, 0) /
                quizSubmissions.length
            )
            : 0;

        const coursesInProgress = startedCourses.filter(course => {
            const progress = calculateCourseProgress(course);
            return progress > 0 && progress < 100;
        }).length;

        const coursesCompleted = startedCourses.filter(course => {
            return calculateCourseProgress(course) === 100;
        }).length;

        return {
            totalLessons,
            completedLessons,
            totalQuizzes,
            averageQuizScore,
            coursesInProgress,
            coursesCompleted,
            totalCourses: startedCourses.length,
        };
    }, [startedCourses, quizSubmissions]);

    return (
        <PageLayout title="Learning & Enablement">
            {/* Header with action button */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">Track your learning progress, courses, and quiz results</p>
                <Link
                    to="/lms"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <BookOpen size={18} />
                    Browse Courses
                </Link>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Courses Completed</h3>
                        <Award className="text-blue-600" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.coursesCompleted}</p>
                    <p className="text-sm text-gray-500 mt-1">of {stats.totalCourses} started</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Lessons Completed</h3>
                        <CheckCircle2 className="text-green-600" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.completedLessons}</p>
                    <p className="text-sm text-gray-500 mt-1">of {stats.totalLessons} total</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Quizzes Taken</h3>
                        <FileText className="text-purple-600" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalQuizzes}</p>
                    <p className="text-sm text-gray-500 mt-1">quizzes completed</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Average Score</h3>
                        <TrendingUp className="text-orange-600" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageQuizScore}%</p>
                    <p className="text-sm text-gray-500 mt-1">across all quizzes</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-6">
                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'courses'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <BookOpen size={18} />
                            My Courses
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('quizzes')}
                        className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'quizzes'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <FileText size={18} />
                            Quiz Results
                        </div>
                    </button>
                </div>
            </div>

            {/* My Courses Tab */}
            {activeTab === 'courses' && (
                <>
                    {startedCourses.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 text-center py-16">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="text-blue-600" size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses started yet</h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Browse our learning center to find courses that interest you.</p>
                            <Link
                                to="/lms"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                <BookOpen size={18} />
                                Browse Courses
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {startedCourses.map((course) => {
                                const progress = calculateCourseProgress(course);
                                const lessonIds = getAllLessonIds(course);
                                const completedCount = lessonIds.filter(id => isLessonCompleted(id)).length;
                                const isComplete = progress === 100;

                                return (
                                    <div
                                        key={course.id}
                                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
                                        onClick={() => navigate(`/lms/${course.slug}`)}
                                    >
                                        {/* Card Header with gradient */}
                                        <div className={`h-2 ${isComplete ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`} />

                                        <div className="p-5">
                                            {/* Status badge */}
                                            <div className="flex items-start justify-between mb-3">
                                                {isComplete ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                                        <CheckCircle2 size={12} />
                                                        Completed
                                                    </span>
                                                ) : progress > 0 ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                                        <Clock size={12} />
                                                        In Progress
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                                        Not Started
                                                    </span>
                                                )}
                                                <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" size={20} />
                                            </div>

                                            {/* Course title */}
                                            <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                {course.title}
                                            </h3>

                                            {/* Course summary */}
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                                {course.summary}
                                            </p>

                                            {/* Progress section */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-500">
                                                        {completedCount} of {lessonIds.length} lessons
                                                    </span>
                                                    <span className={`font-semibold ${isComplete ? 'text-green-600' : 'text-blue-600'}`}>
                                                        {progress}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                    <div
                                                        className={`h-1.5 rounded-full transition-all ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Meta info */}
                                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-400">
                                                {course.duration && (
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        <span>{course.duration}</span>
                                                    </div>
                                                )}
                                                {course.levelLabel && (
                                                    <div className="flex items-center gap-1">
                                                        <Target size={12} />
                                                        <span>{course.levelLabel}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {/* Quiz Results Tab */}
            {activeTab === 'quizzes' && (
                <PageSection>
                    {quizSubmissions.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes taken yet</h3>
                            <p className="text-gray-600 mb-4">Complete lessons with quizzes to see your results here.</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {quizSubmissions.map((quiz, index) => {
                                        const scorePercentage = Math.round((quiz.score / quiz.totalQuestions) * 100);
                                        const passed = quiz.passed !== undefined ? quiz.passed : scorePercentage >= 80;

                                        return (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(quiz.submittedAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {quiz.score}/{quiz.totalQuestions}
                                                        </span>
                                                        <span className="text-sm text-gray-500">({scorePercentage}%)</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${passed
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {passed ? (
                                                            <>
                                                                <CheckCircle2 size={14} />
                                                                Passed
                                                            </>
                                                        ) : (
                                                            <>
                                                                <X size={14} />
                                                                Failed
                                                            </>
                                                        )}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </PageSection>
            )}
        </PageLayout>
    );
};

export default LearningPage;
