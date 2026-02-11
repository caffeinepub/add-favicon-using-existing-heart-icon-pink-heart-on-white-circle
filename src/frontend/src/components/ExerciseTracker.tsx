import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useGetDailyChecklists, useToggleExerciseCompletion, useDeleteExerciseFromChecklist } from '../hooks/useQueries';
import { toast } from 'sonner';
import { CheckSquare, Dumbbell, Heart, Target, Wind, Flame, Calendar, X } from 'lucide-react';
import { DayOfWeek } from '../backend';

interface ExerciseTrackerProps {
  compact?: boolean;
}

const CATEGORY_CONFIG = {
  resistance: { icon: Dumbbell, color: 'text-orange-500', label: 'Resistance' },
  cardio: { icon: Heart, color: 'text-red-500', label: 'Cardio' },
  core: { icon: Target, color: 'text-blue-500', label: 'Core' },
  stretching: { icon: Wind, color: 'text-purple-500', label: 'Stretching' },
};

type CategoryKey = 'resistance' | 'cardio' | 'core' | 'stretching';

export default function ExerciseTracker({ compact = false }: ExerciseTrackerProps) {
  const { data: checklists = [], isLoading } = useGetDailyChecklists();
  const toggleCompletion = useToggleExerciseCompletion();
  const deleteExercise = useDeleteExerciseFromChecklist();

  // Get current date using JavaScript's Date object for accurate display
  const today = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const currentDayName = dayNames[today.getDay()];
  const currentMonth = monthNames[today.getMonth()];
  const currentDate = today.getDate();
  const currentYear = today.getFullYear();
  const fullDateString = `${currentDayName}, ${currentMonth} ${currentDate}, ${currentYear}`;

  // Map JavaScript day to DayOfWeek enum for backend matching
  const todayDayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
    today.getDay()
  ] as DayOfWeek;

  // Get today's checklist - the query already returns only the most recent one per day
  const todayChecklist = todayDayOfWeek 
    ? checklists.find((c) => c.day === todayDayOfWeek) || null
    : null;

  const totalTodayExercises = todayChecklist
    ? todayChecklist.resistance.length + todayChecklist.cardio.length + todayChecklist.core.length + todayChecklist.stretching.length
    : 0;

  const completedTodayExercises = todayChecklist
    ? todayChecklist.resistance.filter((ex) => ex.completed).length +
      todayChecklist.cardio.filter((ex) => ex.completed).length +
      todayChecklist.core.filter((ex) => ex.completed).length +
      todayChecklist.stretching.filter((ex) => ex.completed).length
    : 0;

  // Calculate current streak
  const calculateStreak = () => {
    if (checklists.length === 0) return 0;

    let streak = 0;
    const checkToday = new Date();
    checkToday.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(checkToday);
      checkDate.setDate(checkToday.getDate() - i);
      checkDate.setHours(0, 0, 0, 0);

      const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
        checkDate.getDay()
      ] as DayOfWeek;

      const dayChecklist = checklists.find((c) => c.day === dayOfWeek);

      if (!dayChecklist) {
        if (i === 0) {
          // Today has no checklist, streak is 0
          break;
        }
        // Skip days without checklists in the past
        continue;
      }

      const allExercises = [
        ...dayChecklist.resistance,
        ...dayChecklist.cardio,
        ...dayChecklist.core,
        ...dayChecklist.stretching,
      ];

      const hasPlannedExercise = allExercises.length > 0;
      const hasCompletedExercise = allExercises.some((ex) => ex.completed);

      if (hasPlannedExercise && hasCompletedExercise) {
        streak++;
      } else {
        // Found a day without completed exercises, stop counting
        if (i === 0) {
          // Today has no completed exercises, streak is 0
          streak = 0;
        }
        break;
      }
    }

    return streak;
  };

  const currentStreak = calculateStreak();

  const handleToggleComplete = async (category: CategoryKey, exerciseIndex: number) => {
    if (!todayChecklist || !todayDayOfWeek) return;

    const exercise = todayChecklist[category][exerciseIndex];
    if (!exercise) {
      toast.error('Exercise not found');
      return;
    }

    try {
      await toggleCompletion.mutateAsync({
        day: todayDayOfWeek,
        category,
        index: exerciseIndex,
      });

      if (exercise.completed) {
        toast.info('Exercise marked as incomplete');
      } else {
        toast.success('Exercise completed! 🎉');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to update exercise';
      toast.error(errorMessage);
      console.error('Toggle completion error:', error);
    }
  };

  const handleDeleteExercise = async (category: CategoryKey, exerciseIndex: number) => {
    if (!todayChecklist || !todayDayOfWeek) return;

    const exerciseName = todayChecklist[category][exerciseIndex]?.exercise;
    
    if (!exerciseName) {
      toast.error('Exercise not found');
      return;
    }

    try {
      await deleteExercise.mutateAsync({
        day: todayDayOfWeek,
        category,
        index: exerciseIndex,
      });
      
      toast.success(`Removed "${exerciseName}" from checklist`);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to remove exercise';
      toast.error(errorMessage);
      console.error('Delete exercise error:', error);
    }
  };

  const isAnyMutationPending = toggleCompletion.isPending || deleteExercise.isPending;

  if (compact) {
    return (
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-green-500" />
            Today's Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : totalTodayExercises > 0 ? (
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{completedTodayExercises}</span>
                <span className="text-muted-foreground">/ {totalTodayExercises} completed</span>
              </div>
              {currentStreak > 0 && (
                <div className="flex items-center gap-2 text-orange-600 text-sm">
                  <Flame className="h-4 w-4" />
                  <span className="font-medium">{currentStreak} day streak!</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-muted-foreground">No exercises planned for today</p>
              {currentStreak > 0 && (
                <div className="flex items-center gap-2 text-orange-600 text-sm">
                  <Flame className="h-4 w-4" />
                  <span className="font-medium">{currentStreak} day streak!</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-green-500" />
          Daily Exercise Checklist
        </CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{fullDateString}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckSquare className="h-12 w-12 mx-auto mb-2 opacity-50 animate-pulse" />
            <p>Loading exercises...</p>
          </div>
        ) : totalTodayExercises > 0 && todayChecklist ? (
          <div className="space-y-4">
            {(Object.entries(CATEGORY_CONFIG) as [CategoryKey, typeof CATEGORY_CONFIG[CategoryKey]][]).map(([category, config]) => {
              const exercises = todayChecklist[category];
              if (exercises.length === 0) return null;

              const Icon = config.icon;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center gap-2 font-medium">
                    <Icon className={`h-4 w-4 ${config.color}`} />
                    {config.label}
                  </div>
                  <div className="pl-6 space-y-2">
                    {exercises.map((exercise, idx) => {
                      // Use a stable key combining category, exercise name and index
                      const uniqueKey = `${category}-${exercise.exercise}-${idx}`;
                      
                      return (
                        <div key={uniqueKey} className="flex items-center space-x-2 group">
                          <Checkbox
                            id={uniqueKey}
                            checked={exercise.completed}
                            onCheckedChange={() => handleToggleComplete(category, idx)}
                            disabled={isAnyMutationPending}
                          />
                          <Label 
                            htmlFor={uniqueKey}
                            className={`cursor-pointer flex-1 ${exercise.completed ? 'line-through text-muted-foreground' : ''}`}
                          >
                            {exercise.exercise}
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteExercise(category, idx)}
                            disabled={isAnyMutationPending}
                            title="Remove exercise"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-sm text-green-900 dark:text-green-100 mb-2">Today's Progress</h4>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {completedTodayExercises} / {totalTodayExercises} completed
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <CheckSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No exercises planned for today. Check your weekly planner!</p>
          </div>
        )}

        {currentStreak > 0 && (
          <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <Flame className="h-5 w-5" />
              <div>
                <div className="font-semibold">Current Streak</div>
                <div className="text-2xl font-bold">
                  {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
