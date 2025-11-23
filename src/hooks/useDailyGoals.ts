'use client';

import { useState, useEffect, useCallback } from 'react';

export interface DailyGoal {
  date: string;
  target: number; // lessons per day
  completed: number;
  achieved: boolean;
}

export interface GoalStats {
  currentStreak: number;
  totalGoalsAchieved: number;
  weeklyAverage: number;
  monthlyAverage: number;
}

export function useDailyGoals() {
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [goalStats, setGoalStats] = useState<GoalStats>({
    currentStreak: 0,
    totalGoalsAchieved: 0,
    weeklyAverage: 0,
    monthlyAverage: 0,
  });
  const [defaultDailyTarget, setDefaultDailyTarget] = useState(2); // 2 lessons per day default

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('tumenye-daily-goals');
    const savedTarget = localStorage.getItem('tumenye-daily-target');
    
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);
        setDailyGoals(parsedGoals);
      } catch (error) {
        console.error('Failed to parse daily goals:', error);
      }
    }

    if (savedTarget) {
      setDefaultDailyTarget(parseInt(savedTarget, 10) || 2);
    }
  }, []);

  // Calculate stats when goals change
  useEffect(() => {
    if (dailyGoals.length === 0) return;

    const achieved = dailyGoals.filter(goal => goal.achieved);
    const totalAchieved = achieved.length;
    
    // Calculate current streak (consecutive days with achieved goals)
    let currentStreak = 0;
    const sortedGoals = [...dailyGoals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (const goal of sortedGoals) {
      if (goal.achieved) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate weekly average (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklyGoals = dailyGoals.filter(goal => new Date(goal.date) >= sevenDaysAgo);
    const weeklyCompleted = weeklyGoals.reduce((sum, goal) => sum + goal.completed, 0);
    const weeklyAverage = weeklyGoals.length > 0 ? weeklyCompleted / weeklyGoals.length : 0;

    // Calculate monthly average (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlyGoals = dailyGoals.filter(goal => new Date(goal.date) >= thirtyDaysAgo);
    const monthlyCompleted = monthlyGoals.reduce((sum, goal) => sum + goal.completed, 0);
    const monthlyAverage = monthlyGoals.length > 0 ? monthlyCompleted / monthlyGoals.length : 0;

    setGoalStats({
      currentStreak,
      totalGoalsAchieved: totalAchieved,
      weeklyAverage: Math.round(weeklyAverage * 10) / 10,
      monthlyAverage: Math.round(monthlyAverage * 10) / 10,
    });
  }, [dailyGoals]);

  const getTodayGoal = useCallback((): DailyGoal => {
    const today = new Date().toDateString();
    const existingGoal = dailyGoals.find(goal => goal.date === today);
    
    if (existingGoal) {
      return existingGoal;
    }

    // Create new goal for today
    return {
      date: today,
      target: defaultDailyTarget,
      completed: 0,
      achieved: false,
    };
  }, [dailyGoals, defaultDailyTarget]);

  const updateLessonProgress = useCallback(async () => {
    const today = new Date().toDateString();
    
    setDailyGoals(prev => {
      const existing = prev.find(goal => goal.date === today);
      let updatedGoals;
      
      if (existing) {
        // Update existing goal
        const newCompleted = existing.completed + 1;
        const newAchieved = newCompleted >= existing.target;
        
        updatedGoals = prev.map(goal => 
          goal.date === today 
            ? { ...goal, completed: newCompleted, achieved: newAchieved }
            : goal
        );
      } else {
        // Create new goal for today
        const newGoal: DailyGoal = {
          date: today,
          target: defaultDailyTarget,
          completed: 1,
          achieved: 1 >= defaultDailyTarget,
        };
        updatedGoals = [...prev, newGoal];
      }

      // Save to localStorage
      localStorage.setItem('tumenye-daily-goals', JSON.stringify(updatedGoals));
      return updatedGoals;
    });
  }, [defaultDailyTarget]);

  const setDailyTarget = useCallback((target: number) => {
    setDefaultDailyTarget(target);
    localStorage.setItem('tumenye-daily-target', target.toString());
    
    // Update today's goal target if it exists
    const today = new Date().toDateString();
    setDailyGoals(prev => {
      const updatedGoals = prev.map(goal => 
        goal.date === today 
          ? { ...goal, target, achieved: goal.completed >= target }
          : goal
      );
      localStorage.setItem('tumenye-daily-goals', JSON.stringify(updatedGoals));
      return updatedGoals;
    });
  }, []);

  const getWeeklyGoals = useCallback(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Include today
    
    const weeklyGoals = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(date.getDate() + i);
      const dateString = date.toDateString();
      
      const existingGoal = dailyGoals.find(goal => goal.date === dateString);
      weeklyGoals.push(existingGoal || {
        date: dateString,
        target: defaultDailyTarget,
        completed: 0,
        achieved: false,
      });
    }
    
    return weeklyGoals;
  }, [dailyGoals, defaultDailyTarget]);

  return {
    dailyGoals,
    goalStats,
    defaultDailyTarget,
    getTodayGoal,
    updateLessonProgress,
    setDailyTarget,
    getWeeklyGoals,
  };
}
