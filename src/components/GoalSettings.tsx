'use client';

import { useState, useEffect } from 'react';
import { Target, Settings, Check, X } from 'lucide-react';
import { useDailyGoals } from '@/hooks/useDailyGoals';

interface GoalSettingsProps {
  className?: string;
}

export default function GoalSettings({ className = '' }: GoalSettingsProps) {
  const { defaultDailyTarget, setDailyTarget, loading } = useDailyGoals();
  const [isEditing, setIsEditing] = useState(false);
  const [tempTarget, setTempTarget] = useState(defaultDailyTarget);

  useEffect(() => {
    setTempTarget(defaultDailyTarget);
  }, [defaultDailyTarget]);

  const handleSave = async () => {
    await setDailyTarget(tempTarget);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempTarget(defaultDailyTarget);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Target className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Daily Goal Settings</h3>
          <p className="text-sm text-gray-600">Set your personal learning target</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daily Lesson Target
          </label>
          
          {isEditing ? (
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min="1"
                max="10"
                value={tempTarget}
                onChange={(e) => setTempTarget(parseInt(e.target.value) || 1)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter daily lesson target"
              />
              <button
                onClick={handleSave}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                title="Save"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <span className="text-lg font-semibold text-gray-900">{defaultDailyTarget}</span>
                <span className="text-gray-600 ml-2">
                  lesson{defaultDailyTarget !== 1 ? 's' : ''} per day
                </span>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm">Edit</span>
              </button>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
          <p className="flex items-start space-x-2">
            <span>💡</span>
            <span>
              Your daily goal is personal to you. Set a realistic target that challenges you while 
              fitting your schedule. You can adjust it anytime as your learning pace changes.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div className="p-3 bg-green-50 rounded-md">
            <div className="font-semibold text-green-800">Beginner</div>
            <div className="text-green-600">1-2 lessons/day</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-md">
            <div className="font-semibold text-yellow-800">Intermediate</div>
            <div className="text-yellow-600">3-4 lessons/day</div>
          </div>
          <div className="p-3 bg-red-50 rounded-md">
            <div className="font-semibold text-red-800">Advanced</div>
            <div className="text-red-600">5+ lessons/day</div>
          </div>
        </div>
      </div>
    </div>
  );
}
