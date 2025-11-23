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

interface DbProgress {
  _id: string;
  userId: string;
  moduleId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export function useProgress() {
  const [userProgress, setUserProgress] = useState<UserProgress>({});
  const [loading, setLoading] = useState(true);

  // Load progress from API on mount
  const fetchProgress = useCallback(async () => {
    try {
      const response = await fetch('/api/progress');
      if (response.ok) {
        const dbProgress: DbProgress[] = await response.json();

        
        // Transform API data to local format
        const progressByModule: UserProgress = {};
        
        dbProgress.forEach(progress => {
          const { moduleId, lessonId, completed, score, completedAt } = progress;
          
          if (!progressByModule[moduleId]) {
            progressByModule[moduleId] = {
              moduleId,
              lessons: [],
              completedLessons: 0,
              totalLessons: 0, // Will be set by initializeModule
            };
          }
          
          const lessonProgress: LessonProgress = {
            lessonId,
            completed,
            completedAt: completedAt || new Date().toISOString(),
            quizScore: score,
          };
          
          progressByModule[moduleId].lessons.push(lessonProgress);
          if (completed) {
            progressByModule[moduleId].completedLessons++;
          }
        });
        

        setUserProgress(progressByModule);
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      // Fallback to localStorage
      const savedProgress = localStorage.getItem('tumenye-progress');
      if (savedProgress) {
        try {
          const parsedProgress = JSON.parse(savedProgress);
          if (parsedProgress && typeof parsedProgress === 'object') {

            setUserProgress(parsedProgress);
          }
        } catch (error) {
          console.warn('Invalid progress data, resetting:', error);
          localStorage.removeItem('tumenye-progress');
        }
      } else {

      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

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
        const updated = {
          ...prev,
          [moduleId]: {
            ...prev[moduleId],
            totalLessons
          }
        };

        return updated;
      }
      
      // Only create new module if it doesn't exist
      const newProgress = {
        ...prev,
        [moduleId]: {
          moduleId,
          lessons: [],
          completedLessons: 0,
          totalLessons
        }
      };

      return newProgress;
    });
  }, []);

  const completeLesson = useCallback(async (moduleId: string, lessonId: string, quizScore?: number) => {
    try {
      // Update via API
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleId,
          lessonId,
          completed: true,
          score: quizScore,
        }),
      });

      if (response.ok) {
        // Update local state
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

          const updatedProgress = {
            ...prev,
            [moduleId]: {
              ...module,
              lessons: updatedLessons,
              completedLessons: completedCount
            }
          };

          // Also save to localStorage as backup
          localStorage.setItem('tumenye-progress', JSON.stringify(updatedProgress));
          
          return updatedProgress;
        });
      } else {
        throw new Error('Failed to update progress');
      }
    } catch (error) {
      console.error('Failed to complete lesson:', error);
      
      // Fallback to localStorage only
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
          updatedLessons = [...module.lessons];
          updatedLessons[existingLessonIndex] = lessonProgress;
        } else {
          updatedLessons = [...module.lessons, lessonProgress];
        }

        const completedCount = updatedLessons.filter(l => l.completed).length;

        const updatedProgress = {
          ...prev,
          [moduleId]: {
            ...module,
            lessons: updatedLessons,
            completedLessons: completedCount
          }
        };

        localStorage.setItem('tumenye-progress', JSON.stringify(updatedProgress));
        return updatedProgress;
      });
    }
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
    loading,
    initializeModule,
    completeLesson,
    isLessonCompleted,
    getModuleProgress,
    getLessonScore,
    getOverallProgress,
    resetProgress,
    refetchProgress: fetchProgress,
  };
}
