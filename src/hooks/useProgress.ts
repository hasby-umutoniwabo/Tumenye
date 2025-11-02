'use client';

import { useState, useEffect, useCallback } from 'react';

interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt: string;
  quizScore?: number;
}

interface ModuleProgress {
  moduleId: string;
  lessons: LessonProgress[];
  completedLessons: number;
  totalLessons: number;
}

interface UserProgress {
  [moduleId: string]: ModuleProgress;
}

export function useProgress() {
  const [userProgress, setUserProgress] = useState<UserProgress>({});

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('tumenye-progress');
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        // Validate the progress data structure
        if (parsedProgress && typeof parsedProgress === 'object') {
          setUserProgress(parsedProgress);
        }
      } catch (error) {
        console.warn('Invalid progress data, resetting:', error);
        localStorage.removeItem('tumenye-progress');
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    const hasData = Object.keys(userProgress).length > 0;
    if (hasData) {
      try {
        localStorage.setItem('tumenye-progress', JSON.stringify(userProgress));
      } catch (error) {
        console.warn('Failed to save progress to localStorage:', error);
      }
    }
  }, [userProgress]);

  const initializeModule = useCallback((moduleId: string, totalLessons: number) => {
    setUserProgress(prev => {
      // Don't overwrite existing module data
      if (prev[moduleId]) {
        // Only update if totalLessons is actually different
        if (prev[moduleId].totalLessons === totalLessons) {
          return prev; // No change needed
        }
        return {
          ...prev,
          [moduleId]: {
            ...prev[moduleId],
            totalLessons
          }
        };
      }
      
      // Only create new module if it doesn't exist
      return {
        ...prev,
        [moduleId]: {
          moduleId,
          lessons: [],
          completedLessons: 0,
          totalLessons
        }
      };
    });
  }, []);

  const completeLesson = useCallback((moduleId: string, lessonId: string, quizScore?: number) => {
    setUserProgress(prev => {
      const module = prev[moduleId];
      if (!module) return prev;

      const existingLessonIndex = module.lessons.findIndex(l => l.lessonId === lessonId);
      const lessonProgress: LessonProgress = {
        lessonId,
        completed: true,
        completedAt: new Date().toISOString(),
        quizScore
      };

      let updatedLessons;
      if (existingLessonIndex >= 0) {
        // Update existing lesson
        updatedLessons = [...module.lessons];
        updatedLessons[existingLessonIndex] = lessonProgress;
      } else {
        // Add new lesson
        updatedLessons = [...module.lessons, lessonProgress];
      }

      const completedCount = updatedLessons.filter(l => l.completed).length;

      return {
        ...prev,
        [moduleId]: {
          ...module,
          lessons: updatedLessons,
          completedLessons: completedCount
        }
      };
    });
  }, []);

  const isLessonCompleted = useCallback((moduleId: string, lessonId: string): boolean => {
    const module = userProgress[moduleId];
    if (!module) return false;
    
    const lesson = module.lessons.find(l => l.lessonId === lessonId);
    return lesson?.completed === true;
  }, [userProgress]);

  const getModuleProgress = useCallback((moduleId: string) => {
    return userProgress[moduleId] || null;
  }, [userProgress]);

  const getLessonScore = useCallback((moduleId: string, lessonId: string): number | undefined => {
    const module = userProgress[moduleId];
    if (!module) return undefined;
    
    const lesson = module.lessons.find(l => l.lessonId === lessonId);
    return lesson?.quizScore;
  }, [userProgress]);

  const getOverallProgress = useCallback((): number => {
    const modules = Object.values(userProgress);
    if (modules.length === 0) return 0;
    
    const totalProgress = modules.reduce((acc, module) => {
      return acc + (module.totalLessons > 0 ? (module.completedLessons / module.totalLessons) * 100 : 0);
    }, 0);
    
    return Math.round(totalProgress / modules.length);
  }, [userProgress]);

  const resetProgress = useCallback(() => {
    setUserProgress({});
    localStorage.removeItem('tumenye-progress');
  }, []);

  return {
    userProgress,
    initializeModule,
    completeLesson,
    isLessonCompleted,
    getModuleProgress,
    getLessonScore,
    getOverallProgress,
    resetProgress
  };
}
