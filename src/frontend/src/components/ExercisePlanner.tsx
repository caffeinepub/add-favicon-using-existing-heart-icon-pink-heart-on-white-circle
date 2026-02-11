import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetWeeklyExercisePlans, useAddWeeklyExercisePlan, useDeleteCurrentWeek, useDeleteExerciseFromPlanner, useGetDailyChecklists } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Calendar, Plus, Dumbbell, Heart, Target, Wind, X, Trash2 } from 'lucide-react';
import { DayOfWeek, ExerciseEntry } from '../backend';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const DAYS_OF_WEEK = [
  { value: DayOfWeek.sunday, label: 'Sunday' },
  { value: DayOfWeek.monday, label: 'Monday' },
  { value: DayOfWeek.tuesday, label: 'Tuesday' },
  { value: DayOfWeek.wednesday, label: 'Wednesday' },
  { value: DayOfWeek.thursday, label: 'Thursday' },
  { value: DayOfWeek.friday, label: 'Friday' },
  { value: DayOfWeek.saturday, label: 'Saturday' },
];

const CATEGORIES = [
  { key: 'resistance', label: 'Resistance', icon: Dumbbell, color: 'text-orange-500' },
  { key: 'cardio', label: 'Cardio', icon: Heart, color: 'text-red-500' },
  { key: 'core', label: 'Core', icon: Target, color: 'text-blue-500' },
  { key: 'stretching', label: 'Stretching', icon: Wind, color: 'text-purple-500' },
] as const;

type CategoryKey = 'resistance' | 'cardio' | 'core' | 'stretching';

export default function ExercisePlanner() {
  const { data: exercisePlans = [] } = useGetWeeklyExercisePlans();
  const { data: checklists = [] } = useGetDailyChecklists();
  const addPlan = useAddWeeklyExercisePlan();
  const deleteCurrentWeek = useDeleteCurrentWeek();
  const deleteExercise = useDeleteExerciseFromPlanner();
  const [isPlanning, setIsPlanning] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(DayOfWeek.sunday);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('resistance');
  const [exerciseName, setExerciseName] = useState('');

  // Get current week's start date (Sunday)
  const getCurrentWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    const weekStart = new Date(now.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  };

  const currentWeekStart = getCurrentWeekStart();
  const currentWeekStartTime = BigInt(currentWeekStart.getTime() * 1000000);

  // Find the plan for the current week
  const currentWeekPlan = exercisePlans.find(
    (plan) => plan.weekStartDate === currentWeekStartTime
  );

  // Check if there are any exercises in the current week's checklists
  const hasCurrentWeekExercises = checklists.some((checklist) => {
    return (
      checklist.resistance.length > 0 ||
      checklist.cardio.length > 0 ||
      checklist.core.length > 0 ||
      checklist.stretching.length > 0
    );
  });

  // Show delete button if there's a plan OR if there are any exercises in checklists
  const showDeleteButton = currentWeekPlan || hasCurrentWeekExercises;

  const handleAddExercise = async () => {
    if (!exerciseName.trim()) {
      toast.error('Please enter an exercise name');
      return;
    }

    try {
      // Get existing plan or create new one with all days initialized
      const existingPlan = currentWeekPlan || {
        weekStartDate: currentWeekStartTime,
        dailyPlans: DAYS_OF_WEEK.map((day) => ({
          day: day.value,
          resistance: [],
          cardio: [],
          core: [],
          stretching: [],
        })),
      };

      // Find the day's plan
      const dayIndex = existingPlan.dailyPlans.findIndex((d) => d.day === selectedDay);
      const dayPlan = existingPlan.dailyPlans[dayIndex];

      // Add new exercise to the selected category
      const newExercise: ExerciseEntry = {
        exercise: exerciseName.trim(),
        planned: true,
        completed: false,
      };

      const updatedDayPlan = {
        ...dayPlan,
        [selectedCategory]: [...dayPlan[selectedCategory], newExercise],
      };

      const updatedDailyPlans = [...existingPlan.dailyPlans];
      updatedDailyPlans[dayIndex] = updatedDayPlan;

      const updatedPlan = {
        ...existingPlan,
        dailyPlans: updatedDailyPlans,
      };

      await addPlan.mutateAsync(updatedPlan);
      
      toast.success('Exercise added to plan!');
      setExerciseName('');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to add exercise';
      toast.error(errorMessage);
      console.error('Add exercise error:', error);
    }
  };

  const handleRemoveExercise = async (day: DayOfWeek, category: CategoryKey, exerciseIndex: number, exerciseName: string) => {
    if (!currentWeekPlan) {
      toast.error('No plan found for this week');
      return;
    }

    try {
      // Delete from both planner and checklist using the dedicated hook
      await deleteExercise.mutateAsync({
        weekStartDate: currentWeekStartTime,
        day,
        category,
        index: exerciseIndex,
      });
      
      toast.success(`Removed "${exerciseName}" from plan`);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to remove exercise';
      toast.error(errorMessage);
      console.error('Remove exercise error:', error);
    }
  };

  const handleDeleteWeekPlan = async () => {
    if (!hasCurrentWeekExercises && !currentWeekPlan) {
      toast.error('No week plan found to delete');
      return;
    }

    try {
      // Use deleteCurrentWeek which deletes the current week's plan and checklists
      await deleteCurrentWeek.mutateAsync();
      
      toast.success('Week plan deleted successfully');
      setIsPlanning(false);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to delete week plan';
      toast.error(errorMessage);
      console.error('Delete week plan error:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = CATEGORIES.find((c) => c.key === category);
    if (!cat) return null;
    const Icon = cat.icon;
    return <Icon className={`h-4 w-4 ${cat.color}`} />;
  };

  const isAnyMutationPending = addPlan.isPending || deleteCurrentWeek.isPending || deleteExercise.isPending;

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-pink-500" />
              Weekly Exercise Planner
            </CardTitle>
            <CardDescription>Plan different exercises for each day and category</CardDescription>
          </div>
          {showDeleteButton && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2" disabled={isAnyMutationPending}>
                  <Trash2 className="h-4 w-4" />
                  Delete Week
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete This Week's Plan?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all planned exercises and their completion status for this week. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleteCurrentWeek.isPending}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteWeekPlan} disabled={deleteCurrentWeek.isPending}>
                    {deleteCurrentWeek.isPending ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isPlanning ? (
          <Button onClick={() => setIsPlanning(true)} className="w-full gap-2" disabled={isAnyMutationPending}>
            <Plus className="h-4 w-4" />
            Add Exercise to Plan
          </Button>
        ) : (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <div className="space-y-2">
              <Label>Select Day</Label>
              <div className="grid grid-cols-2 gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <Button
                    key={day.value}
                    type="button"
                    variant={selectedDay === day.value ? 'default' : 'outline'}
                    onClick={() => setSelectedDay(day.value)}
                    size="sm"
                    disabled={isAnyMutationPending}
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Exercise Category</Label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Button
                      key={cat.key}
                      type="button"
                      variant={selectedCategory === cat.key ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(cat.key)}
                      className="gap-2"
                      size="sm"
                      disabled={isAnyMutationPending}
                    >
                      <Icon className={`h-4 w-4 ${selectedCategory === cat.key ? '' : cat.color}`} />
                      {cat.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exerciseName">Exercise or Program Name</Label>
              <Input
                id="exerciseName"
                placeholder="e.g., Upper Body Workout, 5K Run, Yoga Flow"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddExercise();
                  }
                }}
                disabled={isAnyMutationPending}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddExercise} disabled={isAnyMutationPending} className="flex-1">
                {addPlan.isPending ? 'Adding...' : 'Add to Plan'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsPlanning(false)} disabled={isAnyMutationPending}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {checklists.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">This Week's Plan</h4>
            {DAYS_OF_WEEK.map((day) => {
              // Use the deduplicated checklist data
              const dayChecklist = checklists.find((c) => c.day === day.value);
              if (!dayChecklist) return null;

              const hasExercises =
                dayChecklist.resistance.length > 0 ||
                dayChecklist.cardio.length > 0 ||
                dayChecklist.core.length > 0 ||
                dayChecklist.stretching.length > 0;

              if (!hasExercises) return null;

              return (
                <div key={day.value} className="space-y-2 p-3 bg-muted/30 rounded-lg">
                  <h5 className="font-medium text-sm capitalize">{day.label}</h5>
                  <div className="space-y-3 pl-2">
                    {CATEGORIES.map((cat) => {
                      const exercises = dayChecklist[cat.key];
                      if (!exercises || exercises.length === 0) return null;

                      return (
                        <div key={cat.key} className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            {getCategoryIcon(cat.key)}
                            {cat.label}
                          </div>
                          <div className="pl-6 space-y-1">
                            {exercises.map((ex, idx) => {
                              // Use a stable key combining day, category, exercise name and index
                              const uniqueKey = `${day.value}-${cat.key}-${ex.exercise}-${idx}`;
                              
                              return (
                                <div key={uniqueKey} className="flex items-center justify-between text-sm group">
                                  <span className={ex.completed ? 'line-through text-muted-foreground' : ''}>
                                    {ex.exercise}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleRemoveExercise(day.value, cat.key, idx, ex.exercise)}
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
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {checklists.length === 0 && !isPlanning && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No plan for this week yet. Start planning your exercises!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
