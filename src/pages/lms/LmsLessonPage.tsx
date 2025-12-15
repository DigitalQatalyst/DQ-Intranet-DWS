import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  Play,
  Menu,
  X,
  FileText,
  HelpCircle,
  Clock,
  HomeIcon,
} from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useLmsCourse } from '../../hooks/useLmsCourses';
import { fetchQuizByLessonId } from '../../services/lmsService';
import type { LmsQuizRow } from '../../types/lmsSupabase';
import type { LmsDetail } from '../../data/lmsCourseDetails';
import MarkdownRenderer from '../../components/guides/MarkdownRenderer';

type TabType = 'resources' | 'quiz';

// Progress storage key prefix
const PROGRESS_STORAGE_PREFIX = 'lms_lesson_progress_';
const COMPLETION_STORAGE_PREFIX = 'lms_lesson_completed_';
const COURSE_STARTED_PREFIX = 'lms_course_started_';
const QUIZ_STORAGE_PREFIX = 'lms_quiz_submission_';
const QUIZ_PASSED_PREFIX = 'lms_quiz_passed_';

// Quiz passing threshold (80%)
const QUIZ_PASSING_SCORE = 80;

// Helper to get progress from localStorage
function getLessonProgress(lessonId: string): number {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem(`${PROGRESS_STORAGE_PREFIX}${lessonId}`);
  return stored ? parseFloat(stored) : 0;
}

// Helper to save progress to localStorage
function saveLessonProgress(lessonId: string, progress: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${PROGRESS_STORAGE_PREFIX}${lessonId}`, progress.toString());
}

// Helper to check if lesson is completed
function isLessonCompleted(lessonId: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(`${COMPLETION_STORAGE_PREFIX}${lessonId}`) === 'true';
}

// Helper to mark lesson as completed
function markLessonCompleted(lessonId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${COMPLETION_STORAGE_PREFIX}${lessonId}`, 'true');
}

// Helper to check if quiz is passed for a lesson
function isQuizPassed(lessonId: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(`${QUIZ_PASSED_PREFIX}${lessonId}`) === 'true';
}

// Helper to mark quiz as passed
function markQuizPassed(lessonId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${QUIZ_PASSED_PREFIX}${lessonId}`, 'true');
}

// Helper to check if all previous lessons are completed
function arePreviousLessonsCompleted(
  allLessons: Array<{ id: string; order: number }>,
  currentLessonId: string
): boolean {
  const currentLesson = allLessons.find(l => l.id === currentLessonId);
  if (!currentLesson) return true;

  const previousLessons = allLessons.filter(
    l => l.order < currentLesson.order
  );

  return previousLessons.every(l => isLessonCompleted(l.id));
}

export const LmsLessonPage: React.FC = () => {
  const { courseSlug, lessonId } = useParams<{ courseSlug: string; lessonId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('resources');
  const [quiz, setQuiz] = useState<LmsQuizRow | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<{ score: number; total: number } | null>(null);
  const [quizPassed, setQuizPassed] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { data: course, isLoading: courseLoading } = useLmsCourse(courseSlug || '');

  // Get all lessons from curriculum
  const allLessons = useMemo(() => {
    if (!course?.curriculum) return [];
    const lessons: Array<{
      id: string;
      title: string;
      description?: string;
      duration?: string;
      order: number;
      isLocked?: boolean;
      type: string;
      moduleId?: string;
      videoUrl?: string;
      content?: string;
    }> = [];

    course.curriculum.forEach((item) => {
      if (item.lessons) {
        item.lessons.forEach((lesson) => {
          lessons.push({
            ...lesson,
            moduleId: item.id,
          });
        });
      }
      if (item.topics) {
        item.topics.forEach((topic) => {
          if (topic.lessons) {
            topic.lessons.forEach((lesson) => {
              lessons.push({
                ...lesson,
                moduleId: topic.id,
              });
            });
          }
        });
      }
    });

    return lessons.sort((a, b) => a.order - b.order);
  }, [course]);

  // Find current lesson
  const currentLesson = useMemo(() => {
    return allLessons.find(l => l.id === lessonId);
  }, [allLessons, lessonId]);

  // Check if current lesson is locked
  const isLocked = useMemo(() => {
    if (!currentLesson) return false;
    if (currentLesson.isLocked) {
      return !arePreviousLessonsCompleted(allLessons, currentLesson.id);
    }
    return false;
  }, [currentLesson, allLessons]);

  // Get current lesson index
  const currentLessonIndex = useMemo(() => {
    return allLessons.findIndex(l => l.id === lessonId);
  }, [allLessons, lessonId]);

  // Get previous and next lessons
  const previousLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  // Mark course as started when lesson is accessed
  useEffect(() => {
    if (courseSlug && typeof window !== 'undefined') {
      localStorage.setItem(`${COURSE_STARTED_PREFIX}${courseSlug}`, 'true');
    }
  }, [courseSlug]);

  // Load progress and completion state
  useEffect(() => {
    if (lessonId) {
      const progress = getLessonProgress(lessonId);
      const completed = isLessonCompleted(lessonId);
      setVideoProgress(progress);
      setIsVideoCompleted(completed);
    }
  }, [lessonId]);

  // Fetch quiz when lesson changes
  useEffect(() => {
    if (lessonId) {
      setQuizLoading(true);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);
      setQuizPassed(isQuizPassed(lessonId));
      fetchQuizByLessonId(lessonId)
        .then(setQuiz)
        .catch((error) => {
          console.error('Error fetching quiz:', error);
          setQuiz(null);
        })
        .finally(() => setQuizLoading(false));
    }
  }, [lessonId]);

  // Handle quiz submission
  const handleQuizSubmit = () => {
    if (!quiz || !lessonId || !courseSlug) return;

    const questions = quiz.questions || [];
    let correctAnswers = 0;

    questions.forEach((question: any, index: number) => {
      const userAnswer = quizAnswers[index];
      const correctAnswerIndex = question.correct_answer;
      if (userAnswer === correctAnswerIndex) {
        correctAnswers++;
      }
    });

    const score = {
      score: correctAnswers,
      total: questions.length,
    };

    const scorePercentage = Math.round((correctAnswers / questions.length) * 100);
    const passed = scorePercentage >= QUIZ_PASSING_SCORE;

    setQuizScore(score);
    setQuizSubmitted(true);
    setQuizPassed(passed);

    // Store quiz submission in localStorage
    if (typeof window !== 'undefined') {
      const submissionKey = `${QUIZ_STORAGE_PREFIX}${quiz.id}_${lessonId}`;
      const submissionData = {
        quizId: quiz.id,
        lessonId: lessonId,
        courseId: course?.id || '',
        score: correctAnswers,
        totalQuestions: questions.length,
        submittedAt: new Date().toISOString(),
        passed: passed,
      };
      localStorage.setItem(submissionKey, JSON.stringify(submissionData));

      // Store quiz passed status
      if (passed) {
        markQuizPassed(lessonId);
      }
    }
  };

  // Handle quiz retake
  const handleQuizRetake = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setQuizPassed(false);
  };

  // Video event handlers
  const handleVideoTimeUpdate = () => {
    if (!videoRef.current || !currentLesson) return;
    const video = videoRef.current;
    const progress = (video.currentTime / video.duration) * 100;
    setVideoProgress(progress);
    saveLessonProgress(currentLesson.id, progress);

    // Mark as completed if watched >= 90%
    if (progress >= 90 && !isVideoCompleted) {
      setIsVideoCompleted(true);
      markLessonCompleted(currentLesson.id);
    }
  };

  const handleVideoEnded = () => {
    if (currentLesson) {
      setIsVideoCompleted(true);
      markLessonCompleted(currentLesson.id);
      setVideoProgress(100);
      saveLessonProgress(currentLesson.id, 100);
    }
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  // Check if quiz is accessible (video/content must be completed)
  const isQuizAccessible = isVideoCompleted && !isLocked;
  
  // Check if quiz exists and is passed for current lesson
  const currentLessonQuizPassed = useMemo(() => {
    if (!quiz || !lessonId) return true; // No quiz means can proceed
    return quizPassed;
  }, [quiz, lessonId, quizPassed]);
  
  // Check if next lesson can be accessed (quiz must be passed if it exists)
  const canAccessNextLesson = useMemo(() => {
    if (!nextLesson) return false;
    // If there's a quiz for current lesson, it must be passed
    if (quiz && !currentLessonQuizPassed) {
      return false;
    }
    // Check if next lesson is locked
    if (nextLesson.isLocked) {
      return arePreviousLessonsCompleted(allLessons, nextLesson.id);
    }
    return true;
  }, [nextLesson, quiz, currentLessonQuizPassed, allLessons]);

  // Format duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (courseLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading lesson...</p>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Lesson Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find the lesson you're looking for.</p>
            <button
              onClick={() => navigate(courseSlug ? `/lms/${courseSlug}` : '/lms')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Course
            </button>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  // Get video URL and content from lesson
  const videoUrl = currentLesson.videoUrl || null;
  const lessonContent = currentLesson.content || null;
  const hasVideo = !!videoUrl;
  const hasContent = !!lessonContent;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      
      <main className="flex-grow flex flex-col">
        {/* Top Navigation */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to={`/lms/${courseSlug}`}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft size={20} />
                <span>Back to Course</span>
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-sm text-gray-600">Learning Page</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/lms/my-learning"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <FileText size={18} />
                <span>My Learning</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow flex">
          {/* Course Outline Sidebar */}
          <aside
            className={`${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-80 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 ease-in-out`}
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Course Outline</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 text-gray-600 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {allLessons.map((lesson, index) => {
                const isCurrent = lesson.id === lessonId;
                const isCompleted = isLessonCompleted(lesson.id);
                const lessonIsLocked = lesson.isLocked && !arePreviousLessonsCompleted(allLessons, lesson.id);
                const canAccess = !lessonIsLocked;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      if (canAccess) {
                        navigate(`/lms/${courseSlug}/lesson/${lesson.id}`);
                        setSidebarOpen(false);
                      }
                    }}
                    disabled={!canAccess}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      isCurrent
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : canAccess
                        ? 'hover:bg-gray-50 border-2 border-transparent'
                        : 'opacity-60 cursor-not-allowed border-2 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 size={20} className="text-green-500" />
                        ) : lessonIsLocked ? (
                          <Lock size={20} className="text-gray-400" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500">{index + 1}</span>
                          {isCurrent && (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                              NOW PLAYING
                            </span>
                          )}
                          {isCompleted && !isCurrent && (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                              COMPLETED
                            </span>
                          )}
                        </div>
                        <h3
                          className={`text-sm font-medium mb-1 ${
                            isCurrent ? 'text-blue-900' : canAccess ? 'text-gray-900' : 'text-gray-500'
                          }`}
                        >
                          {lesson.title}
                        </h3>
                        {lesson.duration && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock size={12} />
                            <span>{lesson.duration}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Content Section */}
            <div className={`${hasVideo ? 'bg-black' : 'bg-white'} flex-1 flex flex-col`}>
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-5xl">
                  {/* Course and Lesson Title */}
                  <div className={`mb-4 ${hasVideo ? 'text-white' : 'text-gray-900'}`}>
                    <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
                    <h2 className={`text-xl ${hasVideo ? 'text-gray-300' : 'text-gray-700'}`}>{currentLesson.title}</h2>
                  </div>

                  {/* Video Player or Content */}
                  {hasVideo ? (
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                      <video
                        ref={videoRef}
                        src={videoUrl}
                        className="w-full h-full"
                        controls
                        onTimeUpdate={handleVideoTimeUpdate}
                        onEnded={handleVideoEnded}
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPause}
                      />
                      
                      {/* Completion Checkmark Overlay */}
                      {isVideoCompleted && (
                        <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2">
                          <CheckCircle2 size={24} className="text-white" />
                        </div>
                      )}
                    </div>
                  ) : hasContent ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 max-h-[70vh] overflow-y-auto">
                      <MarkdownRenderer body={lessonContent} />
                      {/* Mark as completed button for content-based lessons */}
                      {!isVideoCompleted && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <button
                            onClick={() => {
                              if (currentLesson) {
                                setIsVideoCompleted(true);
                                markLessonCompleted(currentLesson.id);
                                setVideoProgress(100);
                                saveLessonProgress(currentLesson.id, 100);
                              }
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <CheckCircle2 size={20} />
                            <span>Mark as Completed</span>
                          </button>
                        </div>
                      )}
                      {/* Completion indicator */}
                      {isVideoCompleted && (
                        <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-2 text-green-600">
                          <CheckCircle2 size={20} />
                          <span className="font-medium">Lesson Completed</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`w-full rounded-lg overflow-hidden ${hasVideo ? 'bg-gray-900 aspect-video' : 'bg-gray-50 border border-gray-200 p-8'}`}>
                      <div className={`text-center ${hasVideo ? 'text-white' : 'text-gray-600'}`}>
                        <FileText size={64} className={`mx-auto mb-4 ${hasVideo ? 'opacity-50' : 'text-gray-400'}`} />
                        <p className={hasVideo ? 'text-gray-400' : 'text-gray-600'}>
                          {hasVideo ? 'Video content not available' : 'No content available for this lesson'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className={`mt-4 ${hasVideo ? '' : 'bg-white p-4 rounded-lg border border-gray-200'}`}>
                    <div className={`flex items-center justify-between text-sm mb-2 ${hasVideo ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span>Course Progress</span>
                      <span>
                        {allLessons.filter(l => isLessonCompleted(l.id)).length} of {allLessons.length} lessons completed
                      </span>
                    </div>
                    <div className={`w-full rounded-full h-2 ${hasVideo ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${(allLessons.filter(l => isLessonCompleted(l.id)).length / allLessons.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white border-t border-gray-200">
              <div className="max-w-5xl mx-auto">
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('resources')}
                    className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'resources'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={18} />
                      <span>Resources</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('quiz')}
                    disabled={!isQuizAccessible}
                    className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                      activeTab === 'quiz'
                        ? 'border-blue-600 text-blue-600'
                        : isQuizAccessible
                        ? 'border-transparent text-gray-600 hover:text-gray-900'
                        : 'border-transparent text-gray-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <HelpCircle size={18} />
                    <span>Quiz</span>
                    {!isQuizAccessible && (
                      <Lock size={14} className="ml-1" />
                    )}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'resources' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Resources</h3>
                      {currentLesson.description && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700">{currentLesson.description}</p>
                        </div>
                      )}
                      {course.references && course.references.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">References</h4>
                          <ul className="space-y-2">
                            {course.references.map((ref, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <FileText size={16} className="text-gray-400 mt-0.5" />
                                <div>
                                  <p className="text-gray-900 font-medium">{ref.title}</p>
                                  {ref.description && (
                                    <p className="text-sm text-gray-600">{ref.description}</p>
                                  )}
                                  {ref.link && (
                                    <a
                                      href={ref.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-600 hover:underline"
                                    >
                                      View Resource
                                    </a>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'quiz' && (
                    <div>
                      {quizLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading quiz...</p>
                        </div>
                      ) : quiz ? (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                          {quiz.description && (
                            <p className="text-gray-700 mb-6">{quiz.description}</p>
                          )}
                          {quizSubmitted && quizScore ? (
                            <div className={`rounded-lg p-6 mb-6 border ${
                              quizPassed 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-red-50 border-red-200'
                            }`}>
                              <div className="flex items-center gap-3 mb-4">
                                {quizPassed ? (
                                  <>
                                    <CheckCircle2 className="text-green-600" size={24} />
                                    <h4 className="text-lg font-semibold text-green-900">Quiz Passed!</h4>
                                  </>
                                ) : (
                                  <>
                                    <X className="text-red-600" size={24} />
                                    <h4 className="text-lg font-semibold text-red-900">Quiz Not Passed</h4>
                                  </>
                                )}
                              </div>
                              <div className="space-y-3">
                                <p className={`text-gray-700 ${quizPassed ? '' : 'font-medium'}`}>
                                  You scored <span className={`font-bold ${quizPassed ? 'text-green-700' : 'text-red-700'}`}>
                                    {quizScore.score}
                                  </span> out of{' '}
                                  <span className="font-bold">{quizScore.total}</span> questions.
                                </p>
                                <p className={`text-sm font-medium ${quizPassed ? 'text-green-700' : 'text-red-700'}`}>
                                  Score: {Math.round((quizScore.score / quizScore.total) * 100)}% 
                                  {!quizPassed && ` (Minimum ${QUIZ_PASSING_SCORE}% required to pass)`}
                                </p>
                                {!quizPassed && (
                                  <div className="mt-4 pt-4 border-t border-red-200">
                                    <p className="text-sm text-red-800 mb-3">
                                      You need to score at least {QUIZ_PASSING_SCORE}% to proceed to the next lesson. 
                                      Please review the material and retake the quiz.
                                    </p>
                                    <button
                                      onClick={handleQuizRetake}
                                      className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                      Retake Quiz
                                    </button>
                                  </div>
                                )}
                                {quizPassed && (
                                  <div className="mt-4 pt-4 border-t border-green-200">
                                    <p className="text-sm text-green-800">
                                      Congratulations! You can now proceed to the next lesson.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : null}
                          {quiz.questions && Array.isArray(quiz.questions) && quiz.questions.length > 0 ? (
                            <div className="space-y-6">
                              {quiz.questions.map((question: any, index: number) => {
                                const userAnswer = quizAnswers[index];
                                const correctAnswer = question.correct_answer;
                                const isAnswered = userAnswer !== undefined;
                                const isCorrect = isAnswered && userAnswer === correctAnswer;

                                return (
                                  <div
                                    key={index}
                                    className={`rounded-lg p-4 ${
                                      quizSubmitted
                                        ? isCorrect
                                          ? 'bg-green-50 border border-green-200'
                                          : 'bg-red-50 border border-red-200'
                                        : 'bg-gray-50'
                                    }`}
                                  >
                                    <h4 className="font-medium text-gray-900 mb-3">
                                      {index + 1}. {question.question || question.text || 'Question'}
                                    </h4>
                                    {question.options && Array.isArray(question.options) && (
                                      <div className="space-y-2">
                                        {question.options.map((option: string, optIndex: number) => {
                                          const isSelected = userAnswer === optIndex;
                                          const isCorrectOption = optIndex === correctAnswer;

                                          return (
                                            <label
                                              key={optIndex}
                                              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                                                quizSubmitted
                                                  ? isCorrectOption
                                                    ? 'bg-green-100'
                                                    : isSelected && !isCorrectOption
                                                    ? 'bg-red-100'
                                                    : 'hover:bg-gray-100'
                                                  : 'hover:bg-gray-100'
                                              }`}
                                            >
                                              <input
                                                type="radio"
                                                name={`question-${index}`}
                                                value={optIndex}
                                                checked={isSelected}
                                                onChange={() => {
                                                  if (!quizSubmitted) {
                                                    setQuizAnswers((prev) => ({
                                                      ...prev,
                                                      [index]: optIndex,
                                                    }));
                                                  }
                                                }}
                                                disabled={quizSubmitted}
                                                className="text-blue-600"
                                              />
                                              <span className="text-gray-700 flex-1">{option}</span>
                                              {quizSubmitted && isCorrectOption && (
                                                <CheckCircle2 className="text-green-600" size={18} />
                                              )}
                                              {quizSubmitted && isSelected && !isCorrectOption && (
                                                <X className="text-red-600" size={18} />
                                              )}
                                            </label>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                              {!quizSubmitted ? (
                                <button
                                  onClick={handleQuizSubmit}
                                  disabled={Object.keys(quizAnswers).length < (quiz.questions?.length || 0)}
                                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                  Submit Quiz
                                </button>
                              ) : null}
                            </div>
                          ) : (
                            <p className="text-gray-600">No questions available for this quiz.</p>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <HelpCircle size={48} className="mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600">No quiz available for this lesson.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
              <div className="max-w-5xl mx-auto flex items-center justify-between">
                <button
                  onClick={() => previousLesson && navigate(`/lms/${courseSlug}/lesson/${previousLesson.id}`)}
                  disabled={!previousLesson}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    previousLesson
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft size={20} />
                  <span>Previous</span>
                </button>

                <div className="text-sm text-gray-600">
                  Lesson {currentLessonIndex + 1} of {allLessons.length}
                </div>

                <div className="flex flex-col items-end gap-1">
                  <button
                    onClick={() => nextLesson && navigate(`/lms/${courseSlug}/lesson/${nextLesson.id}`)}
                    disabled={!nextLesson || !canAccessNextLesson}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      nextLesson && canAccessNextLesson
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Next Lesson</span>
                    <ChevronRight size={20} />
                  </button>
                  {nextLesson && !canAccessNextLesson && quiz && !quizPassed && (
                    <p className="text-xs text-red-600 mt-1 text-right">
                      Pass the quiz ({QUIZ_PASSING_SCORE}%+) to continue
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default LmsLessonPage;

