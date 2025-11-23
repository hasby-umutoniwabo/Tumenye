'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ModuleCard from '@/components/ModuleCard';
import { modules } from '@/data/modules';
import { useProgress } from '@/hooks/useProgress';
import { useStreak } from '@/hooks/useStreak';
import { Flame, Trophy } from 'lucide-react';

export default function ModulesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { userProgress, loading: progressLoading, initializeModule, getModuleProgress, getOverallProgress, completeLesson } = useProgress();
  const { streakData, loading: streakLoading, updateStreak } = useStreak();
  const loading = progressLoading || streakLoading;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && !progressLoading) {
      // Initialize modules in progress tracking
      modules.forEach(module => {
        initializeModule(module.id, module.lessons.length);
      });
    }
  }, [status, router, initializeModule, progressLoading]);

  const handleModuleClick = (moduleId: string) => {
    router.push(`/modules/${moduleId}`);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tumenye-blue"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Learning Modules</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose a module to start learning. Each module contains interactive lessons and quizzes 
            to help you master essential digital skills.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Streak Card */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Flame className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{streakData.currentStreak} Day Streak</h3>
                <p className="text-orange-100">Keep learning daily to maintain your streak!</p>
                {streakData.longestStreak > 0 && (
                  <p className="text-sm text-orange-200 mt-1">Longest streak: {streakData.longestStreak} days</p>
                )}
              </div>
            </div>
          </div>

          {/* Overall Progress Card */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{getOverallProgress()}% Complete</h3>
                <p className="text-green-100">Your overall learning progress</p>
                {streakData.totalActiveDays > 0 && (
                  <p className="text-sm text-green-200 mt-1">Active for {streakData.totalActiveDays} days</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {modules.map((module) => {
            const progress = getModuleProgress(module.id);
            return (
              <ModuleCard
                key={module.id}
                id={module.id}
                title={module.title}
                description={module.description}
                icon={module.icon}
                progress={progress?.completedLessons || 0}
                totalLessons={progress?.totalLessons || module.lessons.length}
                onClick={() => handleModuleClick(module.id)}
                isClickable={true}
              />
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Learning Progress</h2>

          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module) => {
              const progress = getModuleProgress(module.id);
              const completedLessons = progress?.completedLessons || 0;
              const totalLessons = progress?.totalLessons || module.lessons.length;
              const completionPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

              return (
                <div key={module.id} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 relative">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                        fill="none"
                        stroke={completionPercentage > 0 ? "#3b82f6" : "#e5e7eb"}
                        strokeWidth="3"
                        strokeDasharray={`${completionPercentage}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-700">
                        {Math.round(completionPercentage)}%
                      </span>
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm">{module.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {completedLessons} of {totalLessons} lessons
                  </p>
                </div>
              );
            })}
          </div>

          {/* Overall Progress Summary */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Overall Learning Progress</h3>
                <p className="text-gray-600">
                  {modules.reduce((total, module) => {
                    const progress = getModuleProgress(module.id);
                    return total + (progress?.completedLessons || 0);
                  }, 0)} lessons completed across all modules
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray={`${getOverallProgress()}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-green-600">
                      {getOverallProgress()}%
                    </span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{getOverallProgress()}%</div>
                  <div className="text-sm text-gray-600 font-medium">Complete</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-12 bg-gradient-to-r from-tumenye-blue to-blue-700 rounded-xl text-white p-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-blue-100 mb-6">
              We recommend starting with Microsoft Word Basics if you're new to digital tools. 
              Each lesson builds upon the previous one to ensure you gain confidence and skills progressively.
            </p>
            <button 
              onClick={() => handleModuleClick('microsoft-word')}
              className="group relative bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative flex items-center justify-center space-x-2">
                <span>🚀</span>
                <span>Start with Word Basics</span>
                <span>→</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
