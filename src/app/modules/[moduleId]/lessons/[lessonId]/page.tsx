'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, X, Trophy } from 'lucide-react';
import { modules, Module, LessonData, QuizQuestion } from '@/data/modules';
import { useProgress } from '@/hooks/useProgress';
import { useStreak } from '@/hooks/useStreak';

export default function LessonPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const moduleId = params.moduleId as string;
  const lessonId = params.lessonId as string;

  const [module, setModule] = useState<Module | null>(null);
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [currentSection, setCurrentSection] = useState<'content' | 'quiz'>('content');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { completeLesson, isLessonCompleted } = useProgress();
  const { updateStreak } = useStreak();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      const foundModule = modules.find(m => m.id === moduleId);
      if (!foundModule) {
        router.push('/modules');
        return;
      }

      const foundLesson = foundModule.lessons.find(l => l.id === lessonId);
      if (!foundLesson) {
        router.push(`/modules/${moduleId}`);
        return;
      }

      setModule(foundModule);
      setLesson(foundLesson);
      setSelectedAnswers(new Array(foundLesson.quiz.length).fill(-1));
      setLoading(false);
    }
  }, [status, router, moduleId, lessonId]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (lesson && currentQuestionIndex < lesson.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score and show results
      calculateScore();
    }
  };

  const calculateScore = () => {
    if (!lesson) return;
    
    let correct = 0;
    const results: boolean[] = [];
    
    lesson.quiz.forEach((question, index) => {
      const isCorrect = selectedAnswers[index] === question.correctAnswer;
      results.push(isCorrect);
      if (isCorrect) {
        correct++;
      }
    });
    
    const score = (correct / lesson.quiz.length) * 100;
    setQuizScore(score);
    setCorrectAnswers(results);
    setShowResults(true);
    
    // If score is 80% or higher, automatically mark as completed
    if (score >= 80) {
      completeLesson(moduleId, lessonId, score);
      updateStreak();
    }
  };

  const handleMarkAsCompleted = () => {
    completeLesson(moduleId, lessonId, quizScore);
    updateStreak();
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(lesson!.quiz.length).fill(-1));
    setShowResults(false);
    setShowDetailedResults(false);
    setQuizScore(0);
    setCorrectAnswers([]);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tumenye-blue"></div>
      </div>
    );
  }

  if (!module || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson not found</h1>
          <Link href="/modules" className="text-tumenye-blue hover:text-blue-700">
            Return to modules
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = lesson.quiz[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === lesson.quiz.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href={`/modules/${moduleId}`}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to {module.title}</span>
            </Link>

                                  {isLessonCompleted(moduleId, lessonId) && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setCurrentSection('content')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  currentSection === 'content'
                    ? 'border-tumenye-blue text-tumenye-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Lesson Content
              </button>
              <button
                onClick={() => setCurrentSection('quiz')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  currentSection === 'quiz'
                    ? 'border-tumenye-blue text-tumenye-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Quiz ({lesson.quiz.length} questions)
              </button>
            </nav>
          </div>
        </div>

        {/* Content Section */}
        {currentSection === 'content' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{lesson.title}</h1>
            
            <div className="prose prose-lg max-w-none">
              {lesson.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('#')) {
                  const level = paragraph.match(/^#+/)?.[0].length || 1;
                  const text = paragraph.replace(/^#+\s*/, '');
                  
                  if (level === 1) {
                    return (
                      <h1 key={index} className="text-2xl font-bold text-gray-900 mb-4">
                        {text}
                      </h1>
                    );
                  } else if (level === 2) {
                    return (
                      <h2 key={index} className="text-xl font-bold text-gray-900 mb-3 mt-6">
                        {text}
                      </h2>
                    );
                  } else {
                    return (
                      <h3 key={index} className="text-lg font-bold text-gray-900 mb-2 mt-4">
                        {text}
                      </h3>
                    );
                  }
                }
                
                if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                  const items = paragraph.split('\n').filter(item => item.trim());
                  return (
                    <ul key={index} className="list-disc list-inside space-y-1 mb-4">
                      {items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-700">
                          {item.replace(/^[-*]\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                
                if (paragraph.trim()) {
                  return (
                    <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                }
                
                return null;
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setCurrentSection('quiz')}
                className="bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 hover:shadow-lg hover:cursor-pointer transition-all duration-200 shadow-md"
              >
                Take the Quiz
              </button>
            </div>
          </div>
        )}

        {/* Quiz Section */}
        {currentSection === 'quiz' && !showResults && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Quiz</h2>
                <span className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {lesson.quiz.length}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-tumenye-blue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / lesson.quiz.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {currentQuestion.question}
              </h3>

              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`relative group w-full text-left p-5 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg shadow-blue-200/50'
                        : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-lg hover:shadow-gray-200/50'
                    }`}
                  >
                    {/* Animated background overlay */}
                    <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? 'bg-gradient-to-r from-blue-100/50 to-indigo-100/50'
                        : 'bg-gradient-to-r from-transparent to-transparent group-hover:from-blue-50/50 group-hover:to-indigo-50/50'
                    }`}></div>
                    
                    <div className="relative flex items-center space-x-4">
                      <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                        selectedAnswers[currentQuestionIndex] === index
                          ? 'border-blue-500 bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg'
                          : 'border-gray-300 group-hover:border-blue-400 group-hover:shadow-md'
                      }`}>
                        {selectedAnswers[currentQuestionIndex] === index && (
                          <div className="w-3 h-3 bg-white rounded-full m-0.5 animate-pulse"></div>
                        )}
                      </div>
                      <span className={`font-medium transition-colors duration-300 ${
                        selectedAnswers[currentQuestionIndex] === index
                          ? 'text-blue-700'
                          : 'text-gray-700 group-hover:text-blue-600'
                      }`}>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="group px-8 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 hover:text-gray-900 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-gray-100 disabled:hover:to-gray-200 disabled:hover:shadow-none transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
              >
                <span className="flex items-center space-x-2">
                  <span>←</span>
                  <span>Previous</span>
                </span>
              </button>
              
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestionIndex] === -1}
                className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-indigo-600 disabled:hover:shadow-none transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <span className="relative flex items-center space-x-2">
                  <span>{isLastQuestion ? 'Finish Quiz' : 'Next'}</span>
                  <span>→</span>
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Quiz Results */}
        {showResults && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                quizScore >= 80 ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {quizScore >= 80 ? (
                  <Trophy className="h-10 w-10 text-green-600" />
                ) : (
                  <X className="h-10 w-10 text-yellow-600" />
                )}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
              <p className="text-gray-600 mb-6">
                You scored <span className="font-bold text-tumenye-blue">{Math.round(quizScore)}%</span>
              </p>

              {quizScore >= 80 ? (
                <div className="mb-8">
                  <p className="text-green-700 mb-6 text-lg">
                    Great job! You've demonstrated a solid understanding of the lesson content.
                  </p>
                  {!isLessonCompleted(moduleId, lessonId) && (
                    <button
                      onClick={handleMarkAsCompleted}
                      className="group relative px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <span className="relative flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>Mark Lesson as Completed</span>
                        <span>🎉</span>
                      </span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="mb-8">
                  <p className="text-yellow-700 mb-6 text-lg">
                    You might want to review the lesson content and try the quiz again.
                  </p>
                  <button
                    onClick={handleRetakeQuiz}
                    className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <span className="relative flex items-center space-x-2">
                      <span>🔄</span>
                      <span>Retake Quiz</span>
                    </span>
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href={`/modules/${moduleId}`}
                  className="group relative border-2 border-gray-300 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-400 hover:text-gray-900 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span className="relative flex items-center justify-center space-x-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Module</span>
                  </span>
                </Link>
                <button
                  onClick={() => setCurrentSection('content')}
                  className="group relative bg-gradient-to-r from-gray-200 to-gray-300 text-blue-700 px-8 py-4 rounded-xl font-semibold hover:from-gray-300 hover:to-gray-400 hover:text-blue-800 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span className="relative flex items-center justify-center space-x-2">
                    <span>📖</span>
                    <span>Review Lesson</span>
                  </span>
                </button>
                <button
                  onClick={() => setShowDetailedResults(!showDetailedResults)}
                  className="group relative bg-gradient-to-r from-blue-200 to-indigo-200 text-blue-700 px-8 py-4 rounded-xl font-semibold hover:from-blue-300 hover:to-indigo-300 hover:text-blue-800 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span className="relative flex items-center justify-center space-x-2">
                    <span>📊</span>
                    <span>{showDetailedResults ? 'Hide' : 'Show'} Answers</span>
                  </span>
                </button>
              </div>

              {/* Detailed Quiz Results */}
              {showDetailedResults && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Quiz Review</h3>
                  {lesson.quiz.map((question, index) => (
                    <div key={index} className={`p-6 rounded-xl border-2 ${
                      correctAnswers[index] 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-start space-x-3 mb-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          correctAnswers[index] 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {correctAnswers[index] ? '✓' : '✗'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Question {index + 1}: {question.question}
                          </h4>
                          
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className={`p-3 rounded-lg border ${
                                optionIndex === question.correctAnswer
                                  ? 'border-green-500 bg-green-100 text-green-800'
                                  : optionIndex === selectedAnswers[index]
                                  ? 'border-red-500 bg-red-100 text-red-800'
                                  : 'border-gray-200 bg-white text-gray-700'
                              }`}>
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center space-x-2">
                                    {optionIndex === question.correctAnswer && (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    )}
                                    {optionIndex === selectedAnswers[index] && optionIndex !== question.correctAnswer && (
                                      <X className="h-4 w-4 text-red-600" />
                                    )}
                                  </div>
                                  <span className="font-medium">{option}</span>
                                  {optionIndex === question.correctAnswer && (
                                    <span className="text-sm text-green-600 font-medium">(Correct Answer)</span>
                                  )}
                                  {optionIndex === selectedAnswers[index] && optionIndex !== question.correctAnswer && (
                                    <span className="text-sm text-red-600 font-medium">(Your Answer)</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
