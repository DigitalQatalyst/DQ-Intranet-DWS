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
import { fetchQuizByLessonId, fetchQuizByCourseId } from '../../services/lmsService';
import type { LmsQuizRow } from '../../types/lmsSupabase';
import type { LmsDetail } from '../../data/lmsCourseDetails';
import MarkdownRenderer from '../../components/guides/MarkdownRenderer';

type TabType = 'resources';

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

  const [courseQuiz, setCourseQuiz] = useState<LmsQuizRow | null>(null);

  // Quiz Wizard State
  const [showQuizOverlay, setShowQuizOverlay] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

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

  // Fetch course quiz (final assessment)
  useEffect(() => {
    if (course?.id) {
      fetchQuizByCourseId(course.id)
        .then(setCourseQuiz)
        .catch(console.error);
    }
  }, [course?.id]);

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

      // Trigger quiz if exists and not passed
      if (quiz && !quizPassed) {
        setShowQuizOverlay(true);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsAnswerChecked(false);
      }
    }
  };

  // Quiz Wizard Handlers
  const handleOptionSelect = (optIndex: number) => {
    if (isAnswerChecked || quizSubmitted) return;
    setSelectedOption(optIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || !quiz) return;
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const correct = currentQuestion.correct_answer === selectedOption;

    setIsAnswerCorrect(correct);
    setIsAnswerChecked(true);

    // Save answer
    setQuizAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: selectedOption
    }));
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    if (currentQuestionIndex < quiz.questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      // Reset state, but check if we already have an answer for the next one (if reviewing?)
      // For now, assuming linear forward progression
      const nextAnswer = quizAnswers[currentQuestionIndex + 1];
      setSelectedOption(nextAnswer !== undefined ? nextAnswer : null);
      setIsAnswerChecked(nextAnswer !== undefined);
    } else {
      // Finished
      handleQuizSubmit();
    }
  };

  const handleRetryWizard = () => {
    handleQuizRetake();
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
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
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="w-full flex items-center justify-between">
            {/* Left: Back to Course */}
            <div className="flex items-center">
              <Link
                to={`/lms/${courseSlug}`}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <div className="p-1 rounded-full group-hover:bg-gray-100 transition-colors">
                  <ChevronLeft size={20} />
                </div>
                <span className="font-medium">Back to Course</span>
              </Link>
            </div>

            {/* Right: My Learning */}
            <div className="flex items-center gap-4">
              <Link
                to="/lms/my-learning"
                className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors font-medium"
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
            className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
                    className={`w-full text-left p-3 rounded-lg transition-all ${isCurrent
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
                          className={`text-sm font-medium mb-1 ${isCurrent ? 'text-blue-900' : canAccess ? 'text-gray-900' : 'text-gray-500'
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

                  {/* Video Player or Content or Quiz Overlay */}
                  {showQuizOverlay && quiz ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 min-h-[400px] flex flex-col justify-center overflow-y-auto">
                      {!quizSubmitted ? (
                        <div className="max-w-2xl mx-auto w-full">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Question {currentQuestionIndex + 1} of {quiz.questions.length}</h3>
                            <button
                              onClick={() => setShowQuizOverlay(false)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X size={24} />
                            </button>
                          </div>

                          <div className="mb-6">
                            <h4 className="text-xl font-medium text-gray-900 mb-6">
                              {quiz.questions[currentQuestionIndex].question || quiz.questions[currentQuestionIndex].text}
                            </h4>

                            <div className="space-y-3">
                              {quiz.questions[currentQuestionIndex].options.map((option: string, index: number) => {
                                const isSelected = selectedOption === index;
                                const isCorrectAnswer = quiz.questions[currentQuestionIndex].correct_answer === index;
                                return (
                                  <label
                                    key={index}
                                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${isAnswerChecked
                                      ? isSelected
                                        ? isAnswerCorrect
                                          ? 'border-green-500 bg-green-50'
                                          : 'border-red-500 bg-red-50'
                                        : 'border-gray-200 opacity-60'
                                      : isSelected
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300'
                                      } ${isAnswerChecked ? 'pointer-events-none' : ''}`}
                                  >
                                    <input
                                      type="radio"
                                      name="quiz-option"
                                      checked={isSelected}
                                      onChange={() => handleOptionSelect(index)}
                                      disabled={isAnswerChecked}
                                      className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className={`flex-1 ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>{option}</span>
                                    {isSelected && isAnswerChecked && (
                                      isAnswerCorrect
                                        ? <CheckCircle2 className="text-green-500" size={20} />
                                        : <X className="text-red-500" size={20} />
                                    )}
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {/* Feedback Section */}
                          {isAnswerChecked && (
                            <div className={`p-4 rounded-lg mb-6 ${isAnswerCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              <div className="flex items-center gap-2 font-bold mb-1">
                                {isAnswerCorrect ? <CheckCircle2 size={20} /> : <X size={20} />}
                                <span>{isAnswerCorrect ? 'Correct!' : 'Incorrect'}</span>
                              </div>
                              {isAnswerCorrect && quiz.questions[currentQuestionIndex].explanation ? (
                                <p className="mt-2 text-green-700">{quiz.questions[currentQuestionIndex].explanation}</p>
                              ) : isAnswerCorrect ? (
                                <p>Great job!</p>
                              ) : null}
                            </div>
                          )}

                          <div className="flex justify-end pt-4 border-t border-gray-100">
                            {!isAnswerChecked ? (
                              <button
                                onClick={handleCheckAnswer}
                                disabled={selectedOption === null}
                                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                Submit Answer
                              </button>
                            ) : (
                              <button
                                onClick={handleNextQuestion}
                                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="max-w-md mx-auto text-center">
                          <h3 className="text-2xl font-bold mb-4">{quizPassed ? 'Quiz Passed!' : 'Quiz Not Passed'}</h3>
                          <div className="mb-6">
                            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${quizPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {quizPassed ? <CheckCircle2 size={48} /> : <X size={48} />}
                            </div>
                            <p className="text-xl">
                              You scored <span className="font-bold">{quizScore?.score}</span> out of <span className="font-bold">{quizScore?.total}</span>
                            </p>
                            <p className={`text-sm mt-2 ${quizPassed ? 'text-green-600' : 'text-red-600'}`}>
                              {quizPassed
                                ? 'Congratulations! You can proceed to the next lesson.'
                                : `Score: ${Math.round((quizScore?.score || 0) / (quizScore?.total || 1) * 100)}% (Requires ${QUIZ_PASSING_SCORE}%)`
                              }
                            </p>
                          </div>
                          <div className="flex flex-col gap-3">
                            {quizPassed ? (
                              nextLesson ? (
                                <button
                                  onClick={() => {
                                    navigate(`/lms/${courseSlug}/lesson/${nextLesson.id}`);
                                  }}
                                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  Next Lesson
                                </button>
                              ) : (
                                <button
                                  onClick={() => navigate(`/lms/${courseSlug}`)}
                                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  Back to Course
                                </button>
                              )
                            ) : (
                              <button
                                onClick={handleRetryWizard}
                                className="w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Retake Quiz
                              </button>
                            )}
                            <button
                              onClick={() => setShowQuizOverlay(false)}
                              className="text-gray-500 hover:text-gray-700 text-sm mt-2"
                            >
                              Close Quiz
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : hasVideo ? (
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
                    className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'resources'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={18} />
                      <span>Resources</span>
                    </div>
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


                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
              <div className="max-w-5xl mx-auto flex items-center justify-between">
                <button
                  onClick={() => previousLesson && navigate(`/lms/${courseSlug}/lesson/${previousLesson.id}`)}
                  disabled={!previousLesson}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${previousLesson
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
                  {/* Final Assessment or Next Lesson logic */}
                  {nextLesson ? (
                    <button
                      onClick={() => navigate(`/lms/${courseSlug}/lesson/${nextLesson.id}`)}
                      disabled={!canAccessNextLesson}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${canAccessNextLesson
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      <span>Next Lesson</span>
                      <ChevronRight size={20} />
                    </button>
                  ) : courseQuiz ? (
                    <button
                      onClick={() => navigate(`/lms/${courseSlug}/assessment`)}
                      disabled={quiz && !quizPassed} // Must pass current lesson quiz first
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${(!quiz || quizPassed)
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      <span>Final Assessment</span>
                      <ChevronRight size={20} />
                    </button>
                  ) : null}

                  {nextLesson && !canAccessNextLesson && quiz && !quizPassed && (
                    <p className="text-xs text-red-600 mt-1 text-right">
                      Pass the quiz ({QUIZ_PASSING_SCORE}%+) to continue
                    </p>
                  )}
                  {!nextLesson && courseQuiz && quiz && !quizPassed && (
                    <p className="text-xs text-red-600 mt-1 text-right">
                      Pass the quiz ({QUIZ_PASSING_SCORE}%+) to unlock assessment
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

