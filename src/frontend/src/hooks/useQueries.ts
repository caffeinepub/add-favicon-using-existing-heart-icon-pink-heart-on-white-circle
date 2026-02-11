import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  UserProfile,
  BodyMeasurements,
  WeightRecord,
  WeeklyExercisePlan,
  MoodEnergyLog,
  MotivationalMessage,
  ProgressSummary,
  CalorieEntry,
  BurnedCalorieEntry,
  ProgressPhoto,
  DayOfWeek,
  DayInfo,
  ProgressData,
  StreakData,
  MotivationalSaying,
  DailyChecklist,
} from '../backend';

// Helper function to extract error message from backend errors
function parseBackendError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message;
    
    // Extract the actual error message from IC error format
    // IC errors often come in format: "Call failed: ... Reject text: <actual message>"
    const rejectTextMatch = message.match(/Reject text:\s*(.+?)(?:\n|$)/);
    if (rejectTextMatch) {
      return rejectTextMatch[1].trim();
    }
    
    // Also check for "trapped explicitly:" format
    const trappedMatch = message.match(/trapped explicitly:\s*(.+?)(?:\n|$)/);
    if (trappedMatch) {
      return trappedMatch[1].trim();
    }
    
    return message;
  }
  return String(error);
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.saveCallerUserProfile(profile);
      } catch (error) {
        throw new Error(parseBackendError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetBodyMeasurements() {
  const { actor, isFetching } = useActor();

  return useQuery<BodyMeasurements[]>({
    queryKey: ['bodyMeasurements'],
    queryFn: async () => {
      if (!actor) return [];
      const measurements = await actor.getBodyMeasurements();
      return measurements.sort((a, b) => Number(a.date - b.date));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBodyMeasurement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (measurement: BodyMeasurements) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.addBodyMeasurement(measurement);
      } catch (error) {
        throw new Error(parseBackendError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bodyMeasurements'] });
      queryClient.invalidateQueries({ queryKey: ['progressSummaries'] });
    },
  });
}

export function useUpdateBodyMeasurement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ index, measurement }: { index: number; measurement: BodyMeasurements }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.updateBodyMeasurement(BigInt(index), measurement);
      } catch (error) {
        throw new Error(parseBackendError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bodyMeasurements'] });
      queryClient.invalidateQueries({ queryKey: ['progressSummaries'] });
    },
  });
}

export function useGetWeightRecords() {
  const { actor, isFetching } = useActor();

  return useQuery<WeightRecord[]>({
    queryKey: ['weightRecords'],
    queryFn: async () => {
      if (!actor) return [];
      const records = await actor.getWeightRecords();
      return records.sort((a, b) => Number(a.date - b.date));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddWeightRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: WeightRecord) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.addWeightRecord(record);
      } catch (error) {
        throw new Error(parseBackendError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightRecords'] });
      queryClient.invalidateQueries({ queryKey: ['progressSummaries'] });
    },
  });
}

export function useUpdateWeightRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ index, record }: { index: number; record: WeightRecord }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.updateWeightRecord(BigInt(index), record);
      } catch (error) {
        throw new Error(parseBackendError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightRecords'] });
      queryClient.invalidateQueries({ queryKey: ['progressSummaries'] });
    },
  });
}

export function useGetCalorieEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<CalorieEntry[]>({
    queryKey: ['calorieEntries'],
    queryFn: async () => {
      if (!actor) return [];
      const entries = await actor.getCalorieEntries();
      return entries.sort((a, b) => Number(a.date - b.date));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCalorieEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: CalorieEntry) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.addCalorieEntry(entry);
      } catch (error) {
        throw new Error(parseBackendError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calorieEntries'] });
    },
  });
}

export function useUpdateCalorieEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ index, entry }: { index: number; entry: CalorieEntry }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.updateCalorieEntry(BigInt(index), entry);
      } catch (error) {
        throw new Error(parseBackendError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calorieEntries'] });
    },
  });
}

export function useGetBurnedCalorieEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<BurnedCalorieEntry[]>({
    queryKey: ['burnedCalorieEntries'],
    queryFn: async () => {
      if (!actor) return [];
      const entries = await actor.getBurnedCalorieEntries();
      return entries.sort((a, b) => Number(a.date - b.date));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBurnedCalorieEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: BurnedCalorieEntry) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.addBurnedCalorieEntry(entry);
      } catch (error) {
        throw new Error(parseBackendError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['burnedCalorieEntries'] });
    },
  });
}

export function useUpdateBurnedCalorieEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ index, entry }: { index: number; entry: BurnedCalorieEntry }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('Update burned calorie entry functionality is not yet available. Please delete and re-add the entry instead.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['burnedCalorieEntries'] });
    },
  });
}

export function useGetProgressPhotos() {
  const { actor, isFetching } = useActor();

  return useQuery<ProgressPhoto[]>({
    queryKey: ['progressPhotos'],
    queryFn: async () => {
      if (!actor) return [];
      const photos = await actor.getProgressPhotos();
      return photos.sort((a, b) => Number(a.uploadDate - b.uploadDate));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProgressPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photo: ProgressPhoto) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.addProgressPhoto(photo);
      } catch (error) {
        throw new Error(parseBackendError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progressPhotos'] });
    },
  });
}

export function useDeleteProgressPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (filePath: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.deleteProgressPhoto(filePath);
      } catch (error) {
        throw new Error(parseBackendError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progressPhotos'] });
    },
  });
}

export function useGetWeeklyExercisePlans() {
  const { actor, isFetching } = useActor();

  return useQuery<WeeklyExercisePlan[]>({
    queryKey: ['weeklyExercisePlans'],
    queryFn: async () => {
      if (!actor) return [];
      const plans = await actor.getWeeklyExercisePlans();
      
      // Group plans by weekStartDate and keep only the most recent one for each week
      const plansByWeek = new Map<string, WeeklyExercisePlan>();
      
      plans.forEach((plan) => {
        const weekKey = plan.weekStartDate.toString();
        const existing = plansByWeek.get(weekKey);
        
        // If no existing plan for this week, or if this plan was added later (appears later in array), use it
        if (!existing) {
          plansByWeek.set(weekKey, plan);
        }
      });
      
      // Convert back to array and sort by date
      return Array.from(plansByWeek.values()).sort((a, b) => Number(a.weekStartDate - b.weekStartDate));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCurrentDayInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<DayInfo>({
    queryKey: ['currentDayInfo'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCurrentDayInfo();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

export function useGetDailyChecklists() {
  const { actor, isFetching } = useActor();

  return useQuery<DailyChecklist[]>({
    queryKey: ['dailyChecklists'],
    queryFn: async () => {
      if (!actor) return [];
      const checklists = await actor.getDailyChecklists();
      
      // Deduplicate checklists by day, keeping only the most recent one for each day
      const checklistsByDay = new Map<string, DailyChecklist>();
      
      checklists.forEach((checklist) => {
        const dayKey = checklist.day;
        const existing = checklistsByDay.get(dayKey);
        
        // Keep the checklist with the most recent date
        if (!existing || checklist.date > existing.date) {
          checklistsByDay.set(dayKey, checklist);
        }
      });
      
      return Array.from(checklistsByDay.values());
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProgressData() {
  const { actor, isFetching } = useActor();

  return useQuery<ProgressData>({
    queryKey: ['progressData'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProgressData();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStreakData() {
  const { actor, isFetching } = useActor();

  return useQuery<StreakData>({
    queryKey: ['streakData'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getStreakData();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDailyMotivationalSaying() {
  const { actor, isFetching } = useActor();

  return useQuery<MotivationalSaying>({
    queryKey: ['dailyMotivationalSaying'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDailyMotivationalSaying();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
  });
}

// Helper function to get current week start timestamp
function getCurrentWeekStartTimestamp(): bigint {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  const weekStart = new Date(now.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return BigInt(weekStart.getTime() * 1000000);
}

export function useAddWeeklyExercisePlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: WeeklyExercisePlan) => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        // First, try to delete any existing plan for this week
        try {
          await actor.deleteWeeklyExercisePlan(plan.weekStartDate);
        } catch (error) {
          // Ignore errors if no plan exists to delete
          console.log('No existing plan to delete, creating new one');
        }
        
        // Then add the new/updated plan
        return await actor.addWeeklyExercisePlan(plan);
      } catch (error) {
        throw new Error(parseBackendError(error));
      }
    },
    onSuccess: async () => {
      // Invalidate all related queries to ensure UI is in sync
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['weeklyExercisePlans'] }),
        queryClient.invalidateQueries({ queryKey: ['dailyChecklists'] }),
        queryClient.invalidateQueries({ queryKey: ['progressData'] }),
        queryClient.invalidateQueries({ queryKey: ['streakData'] }),
        queryClient.invalidateQueries({ queryKey: ['progressSummaries'] }),
        queryClient.invalidateQueries({ queryKey: ['motivationalMessages'] }),
      ]);
      
      // Force refetch to ensure we have the latest data
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['weeklyExercisePlans'] }),
        queryClient.refetchQueries({ queryKey: ['dailyChecklists'] }),
      ]);
    },
  });
}

export function useDeleteCurrentWeek() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        // Get the current week start timestamp to match what the backend expects
        const currentWeekStart = getCurrentWeekStartTimestamp();
        
        // Try to delete using the specific week start date
        await actor.deleteWeeklyExercisePlan(currentWeekStart);
      } catch (error) {
        const errorMessage = parseBackendError(error);
        
        if (errorMessage.includes('No exercise plans found')) {
          throw new Error('No week plan found to delete.');
        } else if (errorMessage.includes('Unauthorized')) {
          throw new Error('You do not have permission to delete this week plan.');
        } else {
          throw new Error(errorMessage || 'Failed to delete week plan. Please try again.');
        }
      }
    },
    onSuccess: async () => {
      // Invalidate all related queries and wait for refetch to ensure UI is in sync
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['weeklyExercisePlans'] }),
        queryClient.invalidateQueries({ queryKey: ['dailyChecklists'] }),
        queryClient.invalidateQueries({ queryKey: ['progressData'] }),
        queryClient.invalidateQueries({ queryKey: ['streakData'] }),
        queryClient.invalidateQueries({ queryKey: ['progressSummaries'] }),
        queryClient.invalidateQueries({ queryKey: ['motivationalMessages'] }),
      ]);
      
      // Force refetch to ensure we have the latest data
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['weeklyExercisePlans'] }),
        queryClient.refetchQueries({ queryKey: ['dailyChecklists'] }),
        queryClient.refetchQueries({ queryKey: ['progressData'] }),
      ]);
    },
  });
}

export function useDeleteExerciseFromChecklist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      day,
      category,
      index,
    }: {
      day: DayOfWeek;
      category: string;
      index: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        await actor.deleteExerciseFromChecklist(day, category, BigInt(index));
      } catch (error) {
        const errorMessage = parseBackendError(error);
        
        if (errorMessage.includes('Invalid index')) {
          throw new Error('Exercise not found. It may have already been deleted.');
        } else if (errorMessage.includes('No daily checklists found')) {
          throw new Error('No exercises found to delete.');
        } else if (errorMessage.includes('Unauthorized')) {
          throw new Error('You do not have permission to delete exercises.');
        } else {
          throw new Error(errorMessage || 'Failed to delete exercise. Please try again.');
        }
      }
    },
    onSuccess: async () => {
      // Invalidate all related queries and wait for refetch to ensure UI is in sync
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['dailyChecklists'] }),
        queryClient.invalidateQueries({ queryKey: ['weeklyExercisePlans'] }),
        queryClient.invalidateQueries({ queryKey: ['progressData'] }),
        queryClient.invalidateQueries({ queryKey: ['streakData'] }),
        queryClient.invalidateQueries({ queryKey: ['progressSummaries'] }),
      ]);
      
      // Force refetch to ensure we have the latest data
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['dailyChecklists'] }),
        queryClient.refetchQueries({ queryKey: ['progressData'] }),
      ]);
    },
  });
}

export function useDeleteExerciseFromPlanner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      weekStartDate,
      day,
      category,
      index,
    }: {
      weekStartDate: bigint;
      day: DayOfWeek;
      category: string;
      index: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        // Delete from both planner and checklist to keep them in sync
        await actor.deleteExerciseFromPlanner(weekStartDate, day, category, BigInt(index));
        await actor.deleteExerciseFromChecklist(day, category, BigInt(index));
      } catch (error) {
        const errorMessage = parseBackendError(error);
        
        if (errorMessage.includes('Invalid index')) {
          throw new Error('Exercise not found. It may have already been deleted.');
        } else if (errorMessage.includes('No weekly exercise plans found') || errorMessage.includes('No daily checklists found')) {
          throw new Error('No exercises found to delete.');
        } else if (errorMessage.includes('Unauthorized')) {
          throw new Error('You do not have permission to delete exercises.');
        } else {
          throw new Error(errorMessage || 'Failed to delete exercise. Please try again.');
        }
      }
    },
    onSuccess: async () => {
      // Invalidate all related queries and wait for refetch to ensure UI is in sync
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['weeklyExercisePlans'] }),
        queryClient.invalidateQueries({ queryKey: ['dailyChecklists'] }),
        queryClient.invalidateQueries({ queryKey: ['progressData'] }),
        queryClient.invalidateQueries({ queryKey: ['streakData'] }),
        queryClient.invalidateQueries({ queryKey: ['progressSummaries'] }),
      ]);
      
      // Force refetch to ensure we have the latest data
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['weeklyExercisePlans'] }),
        queryClient.refetchQueries({ queryKey: ['dailyChecklists'] }),
        queryClient.refetchQueries({ queryKey: ['progressData'] }),
      ]);
    },
  });
}

export function useToggleExerciseCompletion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      day,
      category,
      index,
    }: {
      day: DayOfWeek;
      category: string;
      index: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        await actor.toggleExerciseCompletion(day, category, BigInt(index));
      } catch (error) {
        const errorMessage = parseBackendError(error);
        
        if (errorMessage.includes('Invalid index')) {
          throw new Error('Exercise not found. Please refresh the page.');
        } else if (errorMessage.includes('No daily checklists found')) {
          throw new Error('No exercises found.');
        } else if (errorMessage.includes('Unauthorized')) {
          throw new Error('You do not have permission to update exercises.');
        } else {
          throw new Error(errorMessage || 'Failed to update exercise. Please try again.');
        }
      }
    },
    onSuccess: async () => {
      // Invalidate all related queries and wait for refetch
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['dailyChecklists'] }),
        queryClient.invalidateQueries({ queryKey: ['progressData'] }),
        queryClient.invalidateQueries({ queryKey: ['streakData'] }),
        queryClient.invalidateQueries({ queryKey: ['progressSummaries'] }),
      ]);
      
      // Force refetch to ensure we have the latest data
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['dailyChecklists'] }),
        queryClient.refetchQueries({ queryKey: ['progressData'] }),
      ]);
    },
  });
}

export function useGetMoodEnergyLogs() {
  const { actor, isFetching } = useActor();

  return useQuery<MoodEnergyLog[]>({
    queryKey: ['moodEnergyLogs'],
    queryFn: async () => {
      if (!actor) return [];
      const logs = await actor.getMoodEnergyLogs();
      return logs.sort((a, b) => Number(a.date - b.date));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMoodEnergyLog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (log: MoodEnergyLog) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.addMoodEnergyLog(log);
      } catch (error) {
        throw new Error(parseBackendError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodEnergyLogs'] });
    },
  });
}

export function useGetMotivationalMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<MotivationalMessage[]>({
    queryKey: ['motivationalMessages'],
    queryFn: async () => {
      if (!actor) return [];
      const messages = await actor.getMotivationalMessages();
      return messages.sort((a, b) => Number(b.date - a.date));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMotivationalMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: MotivationalMessage) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.addMotivationalMessage(message);
      } catch (error) {
        throw new Error(parseBackendError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motivationalMessages'] });
    },
  });
}

export function useGetProgressSummaries() {
  const { actor, isFetching } = useActor();

  return useQuery<ProgressSummary[]>({
    queryKey: ['progressSummaries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProgressSummaries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProgressSummary() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (summary: ProgressSummary) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.addProgressSummary(summary);
      } catch (error) {
        throw new Error(parseBackendError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progressSummaries'] });
    },
  });
}
