import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
    email: string;
    preferences: UserPreferences;
}
export interface UserPreferences {
    shareProgress: boolean;
    motivationalStyle: MotivationalStyle;
}
export type Time = bigint;
export interface DayInfo {
    dayOfWeek: DayOfWeek;
    fullDate: string;
}
export interface MotivationalSaying {
    author: string;
    message: string;
}
export interface BurnedCalorieSummary {
    dailyTotal: bigint;
    dailyEntries: Array<BurnedCalorieEntry>;
}
export interface BodyMeasurements {
    arms: number;
    bust: number;
    date: Time;
    hips: number;
    legs: number;
}
export interface DailyChecklist {
    day: DayOfWeek;
    core: Array<ExerciseEntry>;
    date: Time;
    stretching: Array<ExerciseEntry>;
    resistance: Array<ExerciseEntry>;
    cardio: Array<ExerciseEntry>;
}
export interface ProgressData {
    weeklyProgress: Array<ExerciseProgress>;
    totalCompletedExercises: bigint;
    totalCardioCompleted: bigint;
    totalStretchingCompleted: bigint;
    totalResistanceCompleted: bigint;
    totalCoreCompleted: bigint;
}
export interface ExerciseProgress {
    day: DayOfWeek;
    stretchingCompleted: bigint;
    cardioCompleted: bigint;
    resistanceCompleted: bigint;
    coreCompleted: bigint;
}
export interface BurnedCalorieEntry {
    date: Time;
    caloriesBurned: bigint;
}
export interface MoodEnergyLog {
    date: Time;
    mood: bigint;
    energy: bigint;
}
export interface WeeklyExercisePlan {
    weekStartDate: Time;
    dailyPlans: Array<DailyExercisePlan>;
}
export interface DailyExercisePlan {
    day: DayOfWeek;
    core: Array<ExerciseEntry>;
    stretching: Array<ExerciseEntry>;
    resistance: Array<ExerciseEntry>;
    cardio: Array<ExerciseEntry>;
}
export interface StreakData {
    maxStreak: bigint;
    currentStreak: bigint;
}
export interface ExerciseEntry {
    completed: boolean;
    exercise: string;
    planned: boolean;
}
export interface CalorieEntry {
    date: Time;
    calories: bigint;
}
export interface MotivationalMessage {
    date: Time;
    type: MotivationalType;
    message: string;
}
export interface ProgressPhoto {
    description: string;
    filePath: string;
    uploadDate: Time;
}
export interface WeightRecord {
    weight: number;
    date: Time;
}
export interface ProgressSummary {
    exerciseConsistency: number;
    weightLossPercentage: number;
    measurementChanges: number;
}
export enum DayOfWeek {
    tuesday = "tuesday",
    wednesday = "wednesday",
    saturday = "saturday",
    thursday = "thursday",
    sunday = "sunday",
    friday = "friday",
    monday = "monday"
}
export enum MotivationalStyle {
    gentle = "gentle",
    direct = "direct",
    balanced = "balanced"
}
export enum MotivationalType {
    monthly = "monthly",
    daily = "daily",
    weekly = "weekly"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBodyMeasurement(measurement: BodyMeasurements): Promise<void>;
    addBurnedCalorieEntry(entry: BurnedCalorieEntry): Promise<void>;
    addCalorieEntry(entry: CalorieEntry): Promise<void>;
    addMoodEnergyLog(log: MoodEnergyLog): Promise<void>;
    addMotivationalMessage(message: MotivationalMessage): Promise<void>;
    addProgressPhoto(photo: ProgressPhoto): Promise<void>;
    addProgressSummary(summary: ProgressSummary): Promise<void>;
    addWeeklyExercisePlan(plan: WeeklyExercisePlan): Promise<void>;
    addWeightRecord(record: WeightRecord): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteCurrentWeek(): Promise<void>;
    deleteExerciseFromChecklist(day: DayOfWeek, category: string, index: bigint): Promise<void>;
    deleteExerciseFromPlanner(weekStartDate: Time, day: DayOfWeek, category: string, index: bigint): Promise<void>;
    deleteProgressPhoto(filePath: string): Promise<void>;
    deleteWeeklyExercisePlan(weekStartDate: Time): Promise<void>;
    getBodyMeasurements(): Promise<Array<BodyMeasurements>>;
    getBurnedCalorieEntries(): Promise<Array<BurnedCalorieEntry>>;
    getBurnedCalorieSummary(): Promise<BurnedCalorieSummary>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCalorieEntries(): Promise<Array<CalorieEntry>>;
    getCurrentDayInfo(): Promise<DayInfo>;
    getDailyChecklists(): Promise<Array<DailyChecklist>>;
    getDailyMotivationalSaying(): Promise<MotivationalSaying>;
    getMoodEnergyLogs(): Promise<Array<MoodEnergyLog>>;
    getMotivationalMessages(): Promise<Array<MotivationalMessage>>;
    getProgressData(): Promise<ProgressData>;
    getProgressPhotos(): Promise<Array<ProgressPhoto>>;
    getProgressSummaries(): Promise<Array<ProgressSummary>>;
    getStreakData(): Promise<StreakData>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWeeklyExercisePlans(): Promise<Array<WeeklyExercisePlan>>;
    getWeightRecords(): Promise<Array<WeightRecord>>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleExerciseCompletion(day: DayOfWeek, category: string, index: bigint): Promise<void>;
    updateBodyMeasurement(index: bigint, updatedMeasurement: BodyMeasurements): Promise<void>;
    updateCalorieEntry(index: bigint, updatedEntry: CalorieEntry): Promise<void>;
    updateWeightRecord(index: bigint, updatedRecord: WeightRecord): Promise<void>;
}
