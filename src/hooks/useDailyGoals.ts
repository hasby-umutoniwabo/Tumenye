'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

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

interface DbGoal {
  _id: string;
  userId: string;
  date: string;
  target: number;
  completed: number;
  achieved: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useDailyGoals() {
  const { data: session, status } = useSession();
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [goalStats, setGoalStats] = useState<GoalStats>({
    currentStreak: 0,
    totalGoalsAchieved: 0,
    weeklyAverage: 0,
    monthlyAverage: 0,
  });
  const [defaultDailyTarget, setDefaultDailyTarget] = useState(2); // 2 lessons per day default
  const [loading, setLoading] = useState(true);

  // Load goals from API when user is authenticated
  const fetchGoals = useCallback(async () => {
    if (status !== 'authenticated' || !session?.user?.email) {
      setLoading(false);
      return;
    }

    try {
      // Fetch goals for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const startDate = thirtyDaysAgo.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const response = await fetch(`/api/goals?startDate=${startDate}`);
      if (response.ok) {
        const dbGoals: DbGoal[] = await response.json();
        
        // Transform API data to local format
        const transformedGoals: DailyGoal[] = dbGoals.map(goal => ({
          date: goal.date,
          target: goal.target,
          completed: goal.completed,
          achieved: goal.achieved,
        }));
        
        setDailyGoals(transformedGoals);
        
        // Load user's default target from the most recent goal or use default
        if (dbGoals.length > 0) {
          const latestGoal = dbGoals[0]; // Goals are sorted by date descending
          setDefaultDailyTarget(latestGoal.target);
        }
      } else if (response.status === 401) {
        // User not authenticated, use localStorage fallback
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Failed to fetch goals:', error);
      // Fallback to localStorage
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  }, [session, status]);

  // Fallback to localStorage for unauthenticated users or API failures
  const loadFromLocalStorage = () => {
    const savedGoals = localStorage.getItem(`tumenye-daily-goals-${session?.user?.email || 'guest'}`);
    const savedTarget = localStorage.getItem(`tumenye-daily-target-${session?.user?.email || 'guest'}`);
    
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
  };

  useEffect(() => {
    if (status !== 'loading') {
      fetchGoals();
    }
  }, [fetchGoals, status]);

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
    const todayISO = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Check for goal with either date format
    const existingGoal = dailyGoals.find(goal => 
      goal.date === today || goal.date === todayISO
    );
    
    if (existingGoal) {
      return {
        ...existingGoal,
        date: today // Normalize to display format
      };
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
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    try {
      if (status === 'authenticated' && session?.user?.email) {
        // Update via API
        const response = await fetch('/api/goals', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: today,
            incrementCompleted: true,
            target: defaultDailyTarget
          })
        });

        if (response.ok) {
          const updatedGoal: DbGoal = await response.json();
          
          // Update local state
          setDailyGoals(prev => {
            const existing = prev.find(goal => goal.date === today);
            
            if (existing) {
              return prev.map(goal => 
                goal.date === today 
                  ? { 
                      date: updatedGoal.date,
                      target: updatedGoal.target,
                      completed: updatedGoal.completed,
                      achieved: updatedGoal.achieved
                    }
                  : goal
              );
            } else {
              return [...prev, {
                date: updatedGoal.date,
                target: updatedGoal.target,
                completed: updatedGoal.completed,
                achieved: updatedGoal.achieved
              }];
            }
          });
          return;
        }
      }
    } catch (error) {
      console.error('Failed to update goal via API:', error);
    }

    // Fallback to localStorage
    const todayString = new Date().toDateString();
    setDailyGoals(prev => {
      const existing = prev.find(goal => goal.date === todayString);
      let updatedGoals;
      
      if (existing) {
        // Update existing goal
        const newCompleted = existing.completed + 1;
        const newAchieved = newCompleted >= existing.target;
        
        updatedGoals = prev.map(goal => 
          goal.date === todayString 
            ? { ...goal, completed: newCompleted, achieved: newAchieved }
            : goal
        );
      } else {
        // Create new goal for today
        const newGoal: DailyGoal = {
          date: todayString,
          target: defaultDailyTarget,
          completed: 1,
          achieved: 1 >= defaultDailyTarget,
        };
        updatedGoals = [...prev, newGoal];
      }

      // Save to localStorage with user-specific key
      const storageKey = `tumenye-daily-goals-${session?.user?.email || 'guest'}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedGoals));
      return updatedGoals;
    });
  }, [defaultDailyTarget, session, status]);

  const setDailyTarget = useCallback(async (target: number) => {
    setDefaultDailyTarget(target);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    try {
      if (status === 'authenticated' && session?.user?.email) {
        // Update via API
        const response = await fetch('/api/goals', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: today,
            target: target
          })
        });

        if (response.ok) {
          const updatedGoal: DbGoal = await response.json();
          
          // Update local state
          setDailyGoals(prev => {
            const existing = prev.find(goal => goal.date === today || goal.date === new Date().toDateString());
            
            if (existing) {
              return prev.map(goal => 
                (goal.date === today || goal.date === new Date().toDateString())
                  ? { 
                      date: new Date().toDateString(), // Keep the display format consistent
                      target: updatedGoal.target,
                      completed: updatedGoal.completed,
                      achieved: updatedGoal.achieved
                    }
                  : goal
              );
            } else {
              return [...prev, {
                date: new Date().toDateString(),
                target: updatedGoal.target,
                completed: updatedGoal.completed,
                achieved: updatedGoal.achieved
              }];
            }
          });
          return;
        }
      }
    } catch (error) {
      console.error('Failed to update goal target via API:', error);
    }

    // Fallback to localStorage
    const storageKey = `tumenye-daily-target-${session?.user?.email || 'guest'}`;
    localStorage.setItem(storageKey, target.toString());
    
    // Update today's goal target if it exists
    const todayString = new Date().toDateString();
    setDailyGoals(prev => {
      const updatedGoals = prev.map(goal => 
        goal.date === todayString 
          ? { ...goal, target, achieved: goal.completed >= target }
          : goal
      );
      const goalsKey = `tumenye-daily-goals-${session?.user?.email || 'guest'}`;
      localStorage.setItem(goalsKey, JSON.stringify(updatedGoals));
      return updatedGoals;
    });
  }, [session, status]);

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
    loading,
    getTodayGoal,
    updateLessonProgress,
    setDailyTarget,
    getWeeklyGoals,
  };
}
