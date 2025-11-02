'use client';

import { useState, useEffect } from 'react';

interface StreakData {
  currentStreak: number;
  lastActivityDate: string | null;
  longestStreak: number;
  totalDays: number;
}

export function useStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    lastActivityDate: null,
    longestStreak: 0,
    totalDays: 0
  });

  // Load streak data from localStorage on mount
  useEffect(() => {
    const savedStreak = localStorage.getItem('tumenye-streak');
    if (savedStreak) {
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
    }
  }, []);

  const updateStreak = () => {
    const today = new Date().toDateString();
    
    setStreakData(prev => {
      const lastActivity = prev.lastActivityDate;
      let newStreak = prev.currentStreak;
      let newTotalDays = prev.totalDays;
      
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
        
        newTotalDays = prev.totalDays + 1;
      }
      
      const newData = {
        currentStreak: newStreak,
        lastActivityDate: today,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        totalDays: newTotalDays
      };
      
      // Save to localStorage
      localStorage.setItem('tumenye-streak', JSON.stringify(newData));
      
      return newData;
    });
  };

  const resetStreak = () => {
    const newData = {
      currentStreak: 0,
      lastActivityDate: null,
      longestStreak: 0,
      totalDays: 0
    };
    
    setStreakData(newData);
    localStorage.setItem('tumenye-streak', JSON.stringify(newData));
  };

  return {
    streakData,
    updateStreak,
    resetStreak
  };
}
