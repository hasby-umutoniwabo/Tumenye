'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Award, BookOpen, CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';
import ProgressBar from '@/components/ProgressBar';
import ModuleCard from '@/components/ModuleCard';
import { modules } from '@/data/modules';
import { useStreak } from '@/hooks/useStreak';

interface UserStats {
  totalModules: number;
  completedModules: number;
  totalLessons: number;
  completedLessons: number;
  overallProgress: number;
  streak: number;
}

interface ModuleProgress {
  moduleId: string;
  completedLessons: number;
  totalLessons: number;
  lastAccessed: Date;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { streakData } = useStreak();
  const [stats, setStats] = useState<UserStats>({
    totalModules: modules.length,
    completedModules: 0,
    totalLessons: modules.reduce((acc, module) => acc + module.lessons.length, 0),
    completedLessons: 0,
    overallProgress: 0,
    streak: 0, // Will be updated with actual streak data
  });
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      // Initialize mock progress data
      const mockProgress: ModuleProgress[] = modules.map(module => ({
        moduleId: module.id,
        completedLessons: Math.floor(Math.random() * (module.lessons.length + 1)),
        totalLessons: module.lessons.length,
        lastAccessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
      }));

      setModuleProgress(mockProgress);

      // Calculate stats
      const totalCompleted = mockProgress.reduce((acc, progress) => acc + progress.completedLessons, 0);
      const completedModulesCount = mockProgress.filter(progress => 
        progress.completedLessons === progress.totalLessons
      ).length;

      setStats(prevStats => ({
        ...prevStats,
        completedModules: completedModulesCount,
        completedLessons: totalCompleted,
        overallProgress: (totalCompleted / prevStats.totalLessons) * 100,
      }));

      setLoading(false);
    }
  }, [status, router]);

  // Separate effect for updating streak data to avoid circular dependency
  useEffect(() => {
    setStats(prevStats => {
      if (prevStats.streak !== streakData.currentStreak) {
        return {
          ...prevStats,
          streak: streakData.currentStreak,
        };
      }
      return prevStats;
    });
  }, [streakData.currentStreak]);

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

  const getProgressLevel = (progress: number) => {
    if (progress === 0) return 'Just Started';
    if (progress < 25) return 'Beginner';
    if (progress < 50) return 'Learning';
    if (progress < 75) return 'Progressing';
    if (progress < 100) return 'Advanced';
    return 'Expert';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Track your learning progress and continue your digital literacy journey.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{Math.round(stats.overallProgress)}%</p>
                <p className="text-gray-600 text-sm">Overall Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.completedLessons}</p>
                <p className="text-gray-600 text-sm">Lessons Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.completedModules}</p>
                <p className="text-gray-600 text-sm">Modules Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.streak}</p>
                <p className="text-gray-600 text-sm">Day Streak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <ProgressBar
              completed={stats.completedLessons}
              total={stats.totalLessons}
              title="Overall Learning Progress"
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Level</h3>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-tumenye-blue to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">
                  {Math.round(stats.overallProgress)}
                </span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {getProgressLevel(stats.overallProgress)}
              </h4>
              <p className="text-gray-600 text-sm">
                Keep learning to reach the next level!
              </p>
            </div>
          </div>
        </div>

        {/* Module Progress */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Module Progress</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {moduleProgress.map((progress) => {
              const module = modules.find(m => m.id === progress.moduleId);
              if (!module) return null;

              return (
                <ModuleCard
                  key={module.id}
                  id={module.id}
                  title={module.title}
                  description={module.description}
                  icon={module.icon}
                  progress={progress.completedLessons}
                  totalLessons={progress.totalLessons}
                  onClick={() => router.push(`/modules/${module.id}`)}
                  isClickable={true}
                />
              );
            })}
          </div>
        </div>

        {/* Recent Activity & Recommendations */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Continue Learning */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Continue Learning</h3>
            <div className="space-y-4">
              {moduleProgress
                .filter(progress => progress.completedLessons < progress.totalLessons)
                .slice(0, 3)
                .map((progress) => {
                  const module = modules.find(m => m.id === progress.moduleId);
                  if (!module) return null;

                  const nextLesson = module.lessons[progress.completedLessons];
                  if (!nextLesson) return null;

                  return (
                    <div
                      key={module.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => router.push(`/modules/${module.id}/lessons/${nextLesson.id}`)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-tumenye-light-blue rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-tumenye-blue" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{nextLesson.title}</h4>
                          <p className="text-sm text-gray-500">{module.title}</p>
                        </div>
                      </div>
                      <div className="text-tumenye-blue">
                        <Clock className="h-5 w-5" />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">First Lesson Completed!</h4>
                  <p className="text-sm text-gray-500">You completed your first lesson</p>
                </div>
              </div>

              {streakData.currentStreak > 0 && (
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{streakData.currentStreak} Day Streak</h4>
                    <p className="text-sm text-gray-500">Keep up the consistency!</p>
                  </div>
                </div>
              )}

              {stats.completedModules > 0 && (
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Module Master</h4>
                    <p className="text-sm text-gray-500">Completed your first module!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-tumenye-blue to-blue-700 rounded-xl text-white p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Continue Learning?</h2>
          <p className="text-blue-100 mb-6">
            You're making great progress! Keep up the momentum and continue building your digital skills.
          </p>
          <Link
            href="/modules"
            className="bg-white text-black px-10 py-4 rounded-lg font-bold hover:bg-gray-100 hover:shadow-lg transition-all duration-200 inline-block shadow-md"
          >
            Continue Learning
          </Link>
        </div>
      </div>
    </div>
  );
}
