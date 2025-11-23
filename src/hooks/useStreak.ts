'use client';

import { useState, useEffect, useCallback } from 'react';

interface StreakData {
  currentStreak: number;
  lastActivityDate: string | null;
  longestStreak: number;
  totalActiveDays: number;
  streakHistory?: Array<{
    date: string;
    lessonsCompleted: number;
  }>;
}

interface DbStreak {
  _id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string;
  totalActiveDays: number;
  streakHistory: Array<{
    date: string;
    lessonsCompleted: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export function useStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    lastActivityDate: null,
    longestStreak: 0,
    totalActiveDays: 0,
    streakHistory: []
  });
  const [loading, setLoading] = useState(true);

  // Load streak data from API
  const fetchStreak = useCallback(async () => {
    try {
      const response = await fetch('/api/streak');
      if (response.ok) {
        const dbStreak: DbStreak = await response.json();
        
        // Transform API data to local format
        const streakData: StreakData = {
          currentStreak: dbStreak.currentStreak,
          longestStreak: dbStreak.longestStreak,
          lastActivityDate: dbStreak.lastActivityDate || null,
          totalActiveDays: dbStreak.totalActiveDays,
          streakHistory: dbStreak.streakHistory || [],
        };
        
        setStreakData(streakData);
      }
    } catch (error) {
      console.error('Failed to fetch streak:', error);
      // Fallback to localStorage
      const savedStreak = localStorage.getItem('tumenye-streak');
      if (savedStreak) {
        try {
          const data = JSON.parse(savedStreak);
          // Check if the streak should be reset due to inactivity
          const today = new Date().toDateString();
          const lastActivity = data.lastActivityDate;
          
          if (lastActivity) {
            const lastDate = new Date(lastActivity);
            const todayDate = new Date(today);
            const diffTime = todayDate.getTime() - lastDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays > 1) {
              // Streak broken - reset current streak but keep records
              setStreakData({
                ...data,
                currentStreak: 0
              });
            } else {
              setStreakData(data);
            }
          } else {
            setStreakData(data);
          }
        } catch (error) {
          console.warn('Invalid streak data, resetting:', error);
          localStorage.removeItem('tumenye-streak');
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  const updateStreak = useCallback(async () => {
    try {
      // Update via API
      const response = await fetch('/api/streak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const dbStreak: DbStreak = await response.json();
        
        // Update local state
        const newStreakData: StreakData = {
          currentStreak: dbStreak.currentStreak,
          longestStreak: dbStreak.longestStreak,
          lastActivityDate: dbStreak.lastActivityDate || null,
          totalActiveDays: dbStreak.totalActiveDays,
          streakHistory: dbStreak.streakHistory || [],
        };
        
        setStreakData(newStreakData);
        
        // Also save to localStorage as backup
        localStorage.setItem('tumenye-streak', JSON.stringify(newStreakData));
      } else {
        throw new Error('Failed to update streak');
      }
    } catch (error) {
      console.error('Failed to update streak:', error);
      
      // Fallback to localStorage only
      const today = new Date().toDateString();
      
      setStreakData(prev => {
        const lastActivity = prev.lastActivityDate;
        let newStreak = prev.currentStreak;
        let newTotalDays = prev.totalActiveDays;
        
        // Only increment if this is a new day
        if (lastActivity !== today) {
          if (lastActivity) {
            const lastDate = new Date(lastActivity);
            const todayDate = new Date(today);
            const diffTime = todayDate.getTime() - lastDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              // Consecutive day - increment streak
              newStreak = prev.currentStreak + 1;
            } else if (diffDays > 1) {
              // Gap in days - restart streak
              newStreak = 1;
            }
          } else {
            // First time activity
            newStreak = 1;
          }
          
          newTotalDays = prev.totalActiveDays + 1;
        }
        
        const newData: StreakData = {
          currentStreak: newStreak,
          lastActivityDate: today,
          longestStreak: Math.max(prev.longestStreak, newStreak),
          totalActiveDays: newTotalDays,
          streakHistory: prev.streakHistory,
        };
        
        // Save to localStorage
        localStorage.setItem('tumenye-streak', JSON.stringify(newData));
        
        return newData;
      });
    }
  }, []);

  const resetStreak = useCallback(async () => {
    const newData: StreakData = {
      currentStreak: 0,
      lastActivityDate: null,
      longestStreak: 0,
      totalActiveDays: 0,
      streakHistory: []
    };
    
    setStreakData(newData);
    localStorage.setItem('tumenye-streak', JSON.stringify(newData));
  }, []);

  return {
    streakData,
    loading,
    updateStreak,
    resetStreak,
    refetchStreak: fetchStreak,
  };
}
