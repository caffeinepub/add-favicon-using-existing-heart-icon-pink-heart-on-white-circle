import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface BodyMeasurements {
  'arms' : number,
  'bust' : number,
  'date' : Time,
  'hips' : number,
  'legs' : number,
}
export interface BurnedCalorieEntry { 'date' : Time, 'caloriesBurned' : bigint }
export interface BurnedCalorieSummary {
  'dailyTotal' : bigint,
  'dailyEntries' : Array<BurnedCalorieEntry>,
}
export interface CalorieEntry { 'date' : Time, 'calories' : bigint }
export interface DailyChecklist {
  'day' : DayOfWeek,
  'core' : Array<ExerciseEntry>,
  'date' : Time,
  'stretching' : Array<ExerciseEntry>,
  'resistance' : Array<ExerciseEntry>,
  'cardio' : Array<ExerciseEntry>,
}
export interface DailyExercisePlan {
  'day' : DayOfWeek,
  'core' : Array<ExerciseEntry>,
  'stretching' : Array<ExerciseEntry>,
  'resistance' : Array<ExerciseEntry>,
  'cardio' : Array<ExerciseEntry>,
}
export interface DayInfo { 'dayOfWeek' : DayOfWeek, 'fullDate' : string }
export type DayOfWeek = { 'tuesday' : null } |
  { 'wednesday' : null } |
  { 'saturday' : null } |
  { 'thursday' : null } |
  { 'sunday' : null } |
  { 'friday' : null } |
  { 'monday' : null };
export interface ExerciseEntry {
  'completed' : boolean,
  'exercise' : string,
  'planned' : boolean,
}
export interface ExerciseProgress {
  'day' : DayOfWeek,
  'stretchingCompleted' : bigint,
  'cardioCompleted' : bigint,
  'resistanceCompleted' : bigint,
  'coreCompleted' : bigint,
}
export interface FileReference { 'hash' : string, 'path' : string }
export interface MoodEnergyLog {
  'date' : Time,
  'mood' : bigint,
  'energy' : bigint,
}
export interface MotivationalMessage {
  'date' : Time,
  'type' : MotivationalType,
  'message' : string,
}
export interface MotivationalSaying { 'author' : string, 'message' : string }
export type MotivationalStyle = { 'gentle' : null } |
  { 'direct' : null } |
  { 'balanced' : null };
export type MotivationalType = { 'monthly' : null } |
  { 'daily' : null } |
  { 'weekly' : null };
export interface ProgressData {
  'weeklyProgress' : Array<ExerciseProgress>,
  'totalCompletedExercises' : bigint,
  'totalCardioCompleted' : bigint,
  'totalStretchingCompleted' : bigint,
  'totalResistanceCompleted' : bigint,
  'totalCoreCompleted' : bigint,
}
export interface ProgressPhoto {
  'description' : string,
  'filePath' : string,
  'uploadDate' : Time,
}
export interface ProgressSummary {
  'exerciseConsistency' : number,
  'weightLossPercentage' : number,
  'measurementChanges' : number,
}
export interface StreakData { 'maxStreak' : bigint, 'currentStreak' : bigint }
export type Time = bigint;
export interface UserPreferences {
  'shareProgress' : boolean,
  'motivationalStyle' : MotivationalStyle,
}
export interface UserProfile {
  'name' : string,
  'email' : string,
  'preferences' : UserPreferences,
}
export type UserRole = { 'admin' : null } |
  { 'user' : null } |
  { 'guest' : null };
export interface WeeklyExercisePlan {
  'weekStartDate' : Time,
  'dailyPlans' : Array<DailyExercisePlan>,
}
export interface WeightRecord { 'weight' : number, 'date' : Time }
export interface _SERVICE {
  'addBodyMeasurement' : ActorMethod<[BodyMeasurements], undefined>,
  'addBurnedCalorieEntry' : ActorMethod<[BurnedCalorieEntry], undefined>,
  'addCalorieEntry' : ActorMethod<[CalorieEntry], undefined>,
  'addMoodEnergyLog' : ActorMethod<[MoodEnergyLog], undefined>,
  'addMotivationalMessage' : ActorMethod<[MotivationalMessage], undefined>,
  'addProgressPhoto' : ActorMethod<[ProgressPhoto], undefined>,
  'addProgressSummary' : ActorMethod<[ProgressSummary], undefined>,
  'addWeeklyExercisePlan' : ActorMethod<[WeeklyExercisePlan], undefined>,
  'addWeightRecord' : ActorMethod<[WeightRecord], undefined>,
  'assignCallerUserRole' : ActorMethod<[Principal, UserRole], undefined>,
  'deleteCurrentWeek' : ActorMethod<[], undefined>,
  'deleteExerciseFromChecklist' : ActorMethod<
    [DayOfWeek, string, bigint],
    undefined
  >,
  'deleteExerciseFromPlanner' : ActorMethod<
    [Time, DayOfWeek, string, bigint],
    undefined
  >,
  'deleteProgressPhoto' : ActorMethod<[string], undefined>,
  'deleteWeeklyExercisePlan' : ActorMethod<[Time], undefined>,
  'dropFileReference' : ActorMethod<[string], undefined>,
  'getBodyMeasurements' : ActorMethod<[], Array<BodyMeasurements>>,
  'getBurnedCalorieEntries' : ActorMethod<[], Array<BurnedCalorieEntry>>,
  'getBurnedCalorieSummary' : ActorMethod<[], BurnedCalorieSummary>,
  'getCallerUserProfile' : ActorMethod<[], [] | [UserProfile]>,
  'getCallerUserRole' : ActorMethod<[], UserRole>,
  'getCalorieEntries' : ActorMethod<[], Array<CalorieEntry>>,
  'getCurrentDayInfo' : ActorMethod<[], DayInfo>,
  'getDailyChecklists' : ActorMethod<[], Array<DailyChecklist>>,
  'getDailyMotivationalSaying' : ActorMethod<[], MotivationalSaying>,
  'getFileReference' : ActorMethod<[string], FileReference>,
  'getMoodEnergyLogs' : ActorMethod<[], Array<MoodEnergyLog>>,
  'getMotivationalMessages' : ActorMethod<[], Array<MotivationalMessage>>,
  'getProgressData' : ActorMethod<[], ProgressData>,
  'getProgressPhotos' : ActorMethod<[], Array<ProgressPhoto>>,
  'getProgressSummaries' : ActorMethod<[], Array<ProgressSummary>>,
  'getStreakData' : ActorMethod<[], StreakData>,
  'getUserProfile' : ActorMethod<[Principal], [] | [UserProfile]>,
  'getWeeklyExercisePlans' : ActorMethod<[], Array<WeeklyExercisePlan>>,
  'getWeightRecords' : ActorMethod<[], Array<WeightRecord>>,
  'initializeAccessControl' : ActorMethod<[], undefined>,
  'isCallerAdmin' : ActorMethod<[], boolean>,
  'listFileReferences' : ActorMethod<[], Array<FileReference>>,
  'registerFileReference' : ActorMethod<[string, string], undefined>,
  'saveCallerUserProfile' : ActorMethod<[UserProfile], undefined>,
  'toggleExerciseCompletion' : ActorMethod<
    [DayOfWeek, string, bigint],
    undefined
  >,
  'updateBodyMeasurement' : ActorMethod<[bigint, BodyMeasurements], undefined>,
  'updateCalorieEntry' : ActorMethod<[bigint, CalorieEntry], undefined>,
  'updateWeightRecord' : ActorMethod<[bigint, WeightRecord], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
