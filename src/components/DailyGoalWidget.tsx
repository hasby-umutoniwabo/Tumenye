'use client';

import { useState } from 'react';
import { Target, Flame } from 'lucide-react';
import { useDailyGoals } from '@/hooks/useDailyGoals';

interface DailyGoalWidgetProps {
  className?: string;
}

export default function DailyGoalWidget({ className = '' }: DailyGoalWidgetProps) {
  const { getTodayGoal, goalStats, setDailyTarget, defaultDailyTarget, getWeeklyGoals, loading } = useDailyGoals();
  const [isSettingTarget, setIsSettingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState(defaultDailyTarget);

  const todayGoal = getTodayGoal();
  const weeklyGoals = getWeeklyGoals();
  const progressPercentage = todayGoal.target > 0 ? (todayGoal.completed / todayGoal.target) * 100 : 0;

  const handleSetTarget = async () => {
    await setDailyTarget(tempTarget);
    setIsSettingTarget(false);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded-full w-16 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Target className="h-5 w-5 text-blue-500 mr-2" />
          Daily Goal
        </h3>
        <button
          onClick={() => setIsSettingTarget(true)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Set Target
        </button>
      </div>

      {/* Today's Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Today's Progress</span>
          <span className="text-sm text-gray-500">
            {todayGoal.completed} / {todayGoal.target} lessons
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              todayGoal.achieved 
                ? 'bg-gradient-to-r from-green-500 to-green-600' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        {todayGoal.achieved ? (
          <div className="flex items-center text-green-600 text-sm">
            <Flame className="h-4 w-4 mr-1" />
            Goal achieved! Great job!
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            {todayGoal.target - todayGoal.completed} more lessons to reach your goal
          </div>
        )}
      </div>

      {/* Weekly Overview */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">This Week</h4>
        <div className="grid grid-cols-7 gap-1">
          {weeklyGoals.map((goal, index) => {
            const date = new Date(goal.date);
            const isToday = goal.date === new Date().toDateString();
            
            return (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500 mb-1">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div
                  className={`h-8 w-8 rounded-full mx-auto flex items-center justify-center text-xs font-medium ${
                    goal.achieved
                      ? 'bg-green-500 text-white'
                      : goal.completed > 0
                      ? 'bg-blue-200 text-blue-800'
                      : isToday
                      ? 'bg-gray-300 text-gray-700 ring-2 ring-blue-500'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {goal.completed}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goal Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-orange-600">{goalStats.currentStreak}</div>
          <div className="text-xs text-gray-500">Goal Streak</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">{goalStats.totalGoalsAchieved}</div>
          <div className="text-xs text-gray-500">Goals Achieved</div>
        </div>
      </div>

      {/* Set Target Modal */}
      {isSettingTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
            <h3 className="text-lg font-semibold mb-4">Set Daily Goal</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lessons per day
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={tempTarget}
                onChange={(e) => setTempTarget(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsSettingTarget(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSetTarget}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
