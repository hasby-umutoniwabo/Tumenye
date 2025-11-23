'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Award, BookOpen, CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';
import ProgressBar from '@/components/ProgressBar';
import ModuleCard from '@/components/ModuleCard';
import ProgressStats from '@/components/ProgressStats';
import DailyGoalWidget from '@/components/DailyGoalWidget';
import { modules } from '@/data/modules';
import { useStreak } from '@/hooks/useStreak';
import { useProgress } from '@/hooks/useProgress';

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
  const { streakData, loading: streakLoading } = useStreak();
  const { userProgress, loading: progressLoading, initializeModule } = useProgress();
  const [stats, setStats] = useState<UserStats>({
    totalModules: modules.length,
    completedModules: 0,
    totalLessons: modules.reduce((acc, module) => acc + module.lessons.length, 0),
    completedLessons: 0,
    overallProgress: 0,
    streak: 0,
  });
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);
  const loading = streakLoading || progressLoading;

  // Initialize modules when component mounts
  useEffect(() => {
    if (status === 'authenticated' && !progressLoading) {
      // Initialize all modules
      modules.forEach(module => {
        initializeModule(module.id, module.lessons.length);
      });
    }
  }, [status, progressLoading, initializeModule]);

  // Update stats when progress data changes
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && !loading) {
      // Calculate real progress from userProgress
      const moduleProgressData: ModuleProgress[] = modules.map(module => {
        const progress = userProgress[module.id];
        return {
          moduleId: module.id,
          completedLessons: progress?.completedLessons || 0,
          totalLessons: module.lessons.length,
          lastAccessed: new Date(), // You could track this more accurately
        };
      });

      setModuleProgress(moduleProgressData);

      // Calculate stats
      const totalCompleted = moduleProgressData.reduce((acc, progress) => acc + progress.completedLessons, 0);
      const completedModulesCount = moduleProgressData.filter(progress => 
        progress.completedLessons === progress.totalLessons
      ).length;

      const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);

      setStats({
        totalModules: modules.length,
        completedModules: completedModulesCount,
        totalLessons,
        completedLessons: totalCompleted,
        overallProgress: totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0,
        streak: streakData.currentStreak,
      });
    }
  }, [status, router, userProgress, streakData, loading]);



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

        {/* Progress Statistics and Daily Goals */}
        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          <div className="lg:col-span-3">
            <ProgressStats />
          </div>
          <div className="lg:col-span-1">
            <DailyGoalWidget />
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
