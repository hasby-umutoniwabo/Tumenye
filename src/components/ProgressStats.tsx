'use client';

import { useEffect } from 'react';
import { Flame, Trophy, Target, TrendingUp, Clock, Award } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { useStreak } from '@/hooks/useStreak';
import { modules } from '@/data/modules';

interface ProgressStatsProps {
  className?: string;
}

export default function ProgressStats({ className = '' }: ProgressStatsProps) {
  const { userProgress, loading: progressLoading, initializeModule, getOverallProgress } = useProgress();
  const { streakData, loading: streakLoading } = useStreak();

  // Initialize modules
  useEffect(() => {
    if (!progressLoading) {
      modules.forEach(module => {
        initializeModule(module.id, module.lessons.length);
      });
    }
  }, [progressLoading, initializeModule]);

  if (progressLoading || streakLoading) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = Object.values(userProgress).reduce(
    (acc, module) => acc + (module?.completedLessons || 0), 
    0
  );
  const completedModules = Object.values(userProgress).filter(
    module => module && module.completedLessons === module.totalLessons
  ).length;
  const overallProgress = getOverallProgress();

  const stats = [
    {
      icon: Flame,
      label: 'Current Streak',
      value: streakData.currentStreak,
      suffix: streakData.currentStreak === 1 ? 'day' : 'days',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Trophy,
      label: 'Lessons Completed',
      value: completedLessons,
      suffix: `of ${totalLessons}`,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: Target,
      label: 'Modules Completed',
      value: completedModules,
      suffix: `of ${modules.length}`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: TrendingUp,
      label: 'Overall Progress',
      value: Math.round(overallProgress),
      suffix: '%',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  const streakHistory = streakData.streakHistory || [];
  const recentActivity = streakHistory.slice(-7); // Last 7 days

  return (
    <div className={className}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value} <span className="text-sm text-gray-500">{stat.suffix}</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Streak Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Streak Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Flame className="h-5 w-5 text-orange-500 mr-2" />
            Streak Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current Streak</span>
              <span className="font-semibold text-orange-600">
                {streakData.currentStreak} {streakData.currentStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Longest Streak</span>
              <span className="font-semibold text-green-600">
                {streakData.longestStreak} {streakData.longestStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Active Days</span>
              <span className="font-semibold text-blue-600">{streakData.totalActiveDays}</span>
            </div>
            {streakData.lastActivityDate && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Activity</span>
                <span className="font-semibold text-gray-700">
                  {new Date(streakData.lastActivityDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 text-blue-500 mr-2" />
            Recent Activity
          </h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-2">
              {recentActivity.reverse().map((activity, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm text-gray-600">
                    {new Date(activity.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-semibold text-gray-700">
                      {activity.lessonsCompleted} lesson{activity.lessonsCompleted !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress by Module */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress by Module</h3>
        <div className="space-y-4">
          {modules.map(module => {
            const moduleProgress = userProgress[module.id];
            const completed = moduleProgress?.completedLessons || 0;
            const total = module.lessons.length;
            const percentage = total > 0 ? (completed / total) * 100 : 0;
            
            return (
              <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900">{module.title}</h4>
                  <span className="text-sm text-gray-500">
                    {completed}/{total} lessons
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-tumenye-blue h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="mt-1 text-right">
                  <span className="text-sm font-medium text-gray-700">
                    {Math.round(percentage)}% complete
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
