'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, CheckCircle, Clock, FileText } from 'lucide-react';
import { modules, Module } from '@/data/modules';
import { useProgress } from '@/hooks/useProgress';

export default function ModulePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const moduleId = params.moduleId as string;
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const { initializeModule, getModuleProgress, isLessonCompleted } = useProgress();
  const initializedRef = useRef<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && moduleId) {
      const foundModule = modules.find(m => m.id === moduleId);
      if (!foundModule) {
        router.push('/modules');
        return;
      }
      
      setModule(foundModule);
      setLoading(false);
    }
  }, [status, router, moduleId]);

  // Separate effect for initializing module to prevent dependency issues
  useEffect(() => {
    if (module && status === 'authenticated' && initializedRef.current !== module.id) {
      initializeModule(module.id, module.lessons.length);
      initializedRef.current = module.id;
    }
  }, [module, initializeModule, status]);

  const handleLessonClick = (lessonId: string) => {
    router.push(`/modules/${moduleId}/lessons/${lessonId}`);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tumenye-blue"></div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Module not found</h1>
          <Link href="/modules" className="text-tumenye-blue hover:text-blue-700">
            Return to modules
          </Link>
        </div>
      </div>
    );
  }

  const moduleProgress = getModuleProgress(moduleId);
  const completionPercentage = moduleProgress ? (moduleProgress.completedLessons / moduleProgress.totalLessons) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link 
              href="/modules"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Modules</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Module Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-tumenye-light-blue rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="h-8 w-8 text-tumenye-blue" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{module.title}</h1>
              <p className="text-gray-600 mb-6">{module.description}</p>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-black font-medium">
                    {moduleProgress?.completedLessons || 0} of {module.lessons.length} lessons completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-tumenye-blue to-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <div className="mt-1 text-right">
                  <span className="text-sm text-gray-500">{Math.round(completionPercentage)}% complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Lessons</h2>
          
          {module.lessons.map((lesson, index) => {
            const isCompleted = isLessonCompleted(moduleId, lesson.id);
            const isNext = index === 0 || isLessonCompleted(moduleId, module.lessons[index - 1].id);

            return (
              <div
                key={lesson.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 ${
                  isNext ? 'hover:shadow-md cursor-pointer hover:border-tumenye-blue' : 'opacity-75'
                }`}
                onClick={isNext ? () => handleLessonClick(lesson.id) : undefined}
              >
                <div className="flex items-center space-x-4">
                  {/* Lesson Status Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-100 text-green-600' 
                      : isNext 
                      ? 'bg-tumenye-light-blue text-tumenye-blue' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : isNext ? (
                      <Play className="h-6 w-6" />
                    ) : (
                      <Clock className="h-6 w-6" />
                    )}
                  </div>

                  {/* Lesson Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-lg font-semibold ${
                        isNext ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        Lesson {index + 1}: {lesson.title}
                      </h3>
                      {isCompleted && (
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                          Completed
                        </span>
                      )}
                    </div>
                    
                    <p className={`mt-1 ${isNext ? 'text-gray-600' : 'text-gray-400'}`}>
                      Interactive lesson with quiz • ~15 min
                    </p>
                    
                    {isNext && !isCompleted && (
                      <div className="mt-4">
                        <span className="group relative inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                          <span className="relative flex items-center space-x-2">
                            <span>🚀</span>
                            <span>Start Lesson</span>
                            <span>→</span>
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Module Completion */}
        {completionPercentage === 100 && (
          <div className="mt-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white p-8 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Congratulations! 🎉</h2>
            <p className="text-green-100 mb-6">
              You have successfully completed the {module.title} module. 
              You're now ready to move on to the next module or explore other areas of digital literacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/modules"
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Explore More Modules
              </Link>
              <Link
                href="/dashboard"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                View Progress
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
