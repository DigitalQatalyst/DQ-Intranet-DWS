import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useLmsCourse } from '../../hooks/useLmsCourses';
import { fetchQuizByCourseId } from '../../services/lmsService';
import type { LmsQuizRow } from '../../types/lmsSupabase';
import { CheckCircle2, X } from 'lucide-react';

const QUIZ_PASSING_SCORE = 80;

export default function LmsCourseAssessmentPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { data: course, isLoading: courseLoading } = useLmsCourse(slug || '');

    const [quiz, setQuiz] = useState<LmsQuizRow | null>(null);
    const [loading, setLoading] = useState(true);

    // Wizard State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizPassed, setQuizPassed] = useState(false);
    const [score, setScore] = useState<{ score: number; total: number } | null>(null);

    useEffect(() => {
        if (course?.id) {
            setLoading(true);
            fetchQuizByCourseId(course.id)
                .then(setQuiz)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [course?.id]);

    const handleOptionSelect = (index: number) => {
        if (isAnswerChecked || quizSubmitted) return;
        setSelectedOption(index);
    };

    const handleCheckAnswer = () => {
        if (!quiz || selectedOption === null) return;
        const currentQuestion = quiz.questions[currentQuestionIndex];
        const correct = currentQuestion.correct_answer === selectedOption;

        setIsAnswerCorrect(correct);
        setIsAnswerChecked(true);

        setQuizAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: selectedOption
        }));
    };

    const handleNextQuestion = () => {
        if (!quiz) return;
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            // Reset for next question
            setSelectedOption(null);
            setIsAnswerChecked(false);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        if (!quiz) return;

        let correctCount = 0;
        quiz.questions.forEach((q: any, i: number) => {
            if (quizAnswers[i] === q.correct_answer) {
                correctCount++;
            }
        });

        const passed = (correctCount / quiz.questions.length) * 100 >= QUIZ_PASSING_SCORE;
        setScore({ score: correctCount, total: quiz.questions.length });
        setQuizPassed(passed);
        setQuizSubmitted(true);
    };

    const handleRetake = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsAnswerChecked(false);
        setQuizAnswers({});
        setQuizSubmitted(false);
        setQuizPassed(false);
        setScore(null);
    };

    if (courseLoading || loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (!course || !quiz) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
                <div className="flex-grow flex items-center justify-center p-4 text-center">
                    <h2 className="text-2xl font-bold mb-2">Assessment Not Found</h2>
                    <p className="text-gray-600 mb-6">There is no final assessment available for this course.</p>
                    <Link to={`/lms/${slug}`} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Back to Course</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                        <h1 className="text-xl font-bold text-gray-900 mb-1">{quiz.title || 'Course Assessment'}</h1>
                        <p className="text-gray-500 text-sm">{course.title}</p>
                    </div>

                    <div className="p-8">
                        {!quizSubmitted ? (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-sm font-medium text-gray-500">Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                                </div>

                                <h3 className="text-xl font-medium text-gray-900 mb-6 leading-relaxed">
                                    {quiz.questions[currentQuestionIndex].question || quiz.questions[currentQuestionIndex].text}
                                </h3>

                                <div className="space-y-3 mb-8">
                                    {quiz.questions[currentQuestionIndex].options.map((option: string, index: number) => {
                                        const isSelected = selectedOption === index;
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleOptionSelect(index)}
                                                disabled={isAnswerChecked}
                                                className={`w-full text-left p-4 rounded-lg border-2 transition-all flex justify-between items-center ${isSelected
                                                        ? isAnswerChecked
                                                            ? isAnswerCorrect
                                                                ? 'border-green-500 bg-green-50'
                                                                : 'border-red-500 bg-red-50'
                                                            : 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-blue-300'
                                                    }`}
                                            >
                                                <span className={`${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>{option}</span>
                                                {isSelected && isAnswerChecked && (
                                                    isAnswerCorrect
                                                        ? <CheckCircle2 className="text-green-500" size={20} />
                                                        : <X className="text-red-500" size={20} />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {isAnswerChecked && (
                                    <div className={`p-4 rounded-lg mb-6 ${isAnswerCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        <div className="flex items-center gap-2 font-bold mb-1">
                                            {isAnswerCorrect ? <CheckCircle2 size={20} /> : <X size={20} />}
                                            <span>{isAnswerCorrect ? 'Correct!' : 'Incorrect'}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end pt-6 border-t border-gray-100">
                                    {!isAnswerChecked ? (
                                        <button
                                            onClick={handleCheckAnswer}
                                            disabled={selectedOption === null}
                                            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Check Answer
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleNextQuestion}
                                            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${quizPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {quizPassed ? <CheckCircle2 size={48} /> : <X size={48} />}
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">{quizPassed ? 'Assessment Passed!' : 'Assessment Failed'}</h2>
                                <p className="text-xl text-gray-600 mb-8">
                                    You scored <span className="font-bold text-gray-900">{score?.score}</span> out of <span className="font-bold text-gray-900">{score?.total}</span>
                                </p>

                                <div className="max-w-xs mx-auto space-y-3">
                                    {quizPassed ? (
                                        <Link
                                            to={`/lms/${slug}`}
                                            className="block w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Return to Course
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={handleRetake}
                                            className="block w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            Retake Assessment
                                        </button>
                                    )}
                                    <Link to={`/lms/${slug}`} className="block text-gray-500 hover:text-gray-900 py-2">
                                        Cancel
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer isLoggedIn={false} />
        </div>
    );
}
