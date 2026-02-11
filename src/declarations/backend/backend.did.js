export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const BodyMeasurements = IDL.Record({
    'arms' : IDL.Float64,
    'bust' : IDL.Float64,
    'date' : Time,
    'hips' : IDL.Float64,
    'legs' : IDL.Float64,
  });
  const BurnedCalorieEntry = IDL.Record({
    'date' : Time,
    'caloriesBurned' : IDL.Int,
  });
  const CalorieEntry = IDL.Record({ 'date' : Time, 'calories' : IDL.Int });
  const MoodEnergyLog = IDL.Record({
    'date' : Time,
    'mood' : IDL.Int,
    'energy' : IDL.Int,
  });
  const MotivationalType = IDL.Variant({
    'monthly' : IDL.Null,
    'daily' : IDL.Null,
    'weekly' : IDL.Null,
  });
  const MotivationalMessage = IDL.Record({
    'date' : Time,
    'type' : MotivationalType,
    'message' : IDL.Text,
  });
  const ProgressPhoto = IDL.Record({
    'description' : IDL.Text,
    'filePath' : IDL.Text,
    'uploadDate' : Time,
  });
  const ProgressSummary = IDL.Record({
    'exerciseConsistency' : IDL.Float64,
    'weightLossPercentage' : IDL.Float64,
    'measurementChanges' : IDL.Float64,
  });
  const DayOfWeek = IDL.Variant({
    'tuesday' : IDL.Null,
    'wednesday' : IDL.Null,
    'saturday' : IDL.Null,
    'thursday' : IDL.Null,
    'sunday' : IDL.Null,
    'friday' : IDL.Null,
    'monday' : IDL.Null,
  });
  const ExerciseEntry = IDL.Record({
    'completed' : IDL.Bool,
    'exercise' : IDL.Text,
    'planned' : IDL.Bool,
  });
  const DailyExercisePlan = IDL.Record({
    'day' : DayOfWeek,
    'core' : IDL.Vec(ExerciseEntry),
    'stretching' : IDL.Vec(ExerciseEntry),
    'resistance' : IDL.Vec(ExerciseEntry),
    'cardio' : IDL.Vec(ExerciseEntry),
  });
  const WeeklyExercisePlan = IDL.Record({
    'weekStartDate' : Time,
    'dailyPlans' : IDL.Vec(DailyExercisePlan),
  });
  const WeightRecord = IDL.Record({ 'weight' : IDL.Float64, 'date' : Time });
  const UserRole = IDL.Variant({
    'admin' : IDL.Null,
    'user' : IDL.Null,
    'guest' : IDL.Null,
  });
  const BurnedCalorieSummary = IDL.Record({
    'dailyTotal' : IDL.Nat,
    'dailyEntries' : IDL.Vec(BurnedCalorieEntry),
  });
  const MotivationalStyle = IDL.Variant({
    'gentle' : IDL.Null,
    'direct' : IDL.Null,
    'balanced' : IDL.Null,
  });
  const UserPreferences = IDL.Record({
    'shareProgress' : IDL.Bool,
    'motivationalStyle' : MotivationalStyle,
  });
  const UserProfile = IDL.Record({
    'name' : IDL.Text,
    'email' : IDL.Text,
    'preferences' : UserPreferences,
  });
  const DayInfo = IDL.Record({
    'dayOfWeek' : DayOfWeek,
    'fullDate' : IDL.Text,
  });
  const DailyChecklist = IDL.Record({
    'day' : DayOfWeek,
    'core' : IDL.Vec(ExerciseEntry),
    'date' : Time,
    'stretching' : IDL.Vec(ExerciseEntry),
    'resistance' : IDL.Vec(ExerciseEntry),
    'cardio' : IDL.Vec(ExerciseEntry),
  });
  const MotivationalSaying = IDL.Record({
    'author' : IDL.Text,
    'message' : IDL.Text,
  });
  const FileReference = IDL.Record({ 'hash' : IDL.Text, 'path' : IDL.Text });
  const ExerciseProgress = IDL.Record({
    'day' : DayOfWeek,
    'stretchingCompleted' : IDL.Nat,
    'cardioCompleted' : IDL.Nat,
    'resistanceCompleted' : IDL.Nat,
    'coreCompleted' : IDL.Nat,
  });
  const ProgressData = IDL.Record({
    'weeklyProgress' : IDL.Vec(ExerciseProgress),
    'totalCompletedExercises' : IDL.Nat,
    'totalCardioCompleted' : IDL.Nat,
    'totalStretchingCompleted' : IDL.Nat,
    'totalResistanceCompleted' : IDL.Nat,
    'totalCoreCompleted' : IDL.Nat,
  });
  const StreakData = IDL.Record({
    'maxStreak' : IDL.Nat,
    'currentStreak' : IDL.Nat,
  });
  return IDL.Service({
    'addBodyMeasurement' : IDL.Func([BodyMeasurements], [], []),
    'addBurnedCalorieEntry' : IDL.Func([BurnedCalorieEntry], [], []),
    'addCalorieEntry' : IDL.Func([CalorieEntry], [], []),
    'addMoodEnergyLog' : IDL.Func([MoodEnergyLog], [], []),
    'addMotivationalMessage' : IDL.Func([MotivationalMessage], [], []),
    'addProgressPhoto' : IDL.Func([ProgressPhoto], [], []),
    'addProgressSummary' : IDL.Func([ProgressSummary], [], []),
    'addWeeklyExercisePlan' : IDL.Func([WeeklyExercisePlan], [], []),
    'addWeightRecord' : IDL.Func([WeightRecord], [], []),
    'assignCallerUserRole' : IDL.Func([IDL.Principal, UserRole], [], []),
    'deleteCurrentWeek' : IDL.Func([], [], []),
    'deleteExerciseFromChecklist' : IDL.Func(
        [DayOfWeek, IDL.Text, IDL.Nat],
        [],
        [],
      ),
    'deleteExerciseFromPlanner' : IDL.Func(
        [Time, DayOfWeek, IDL.Text, IDL.Nat],
        [],
        [],
      ),
    'deleteProgressPhoto' : IDL.Func([IDL.Text], [], []),
    'deleteWeeklyExercisePlan' : IDL.Func([Time], [], []),
    'dropFileReference' : IDL.Func([IDL.Text], [], []),
    'getBodyMeasurements' : IDL.Func(
        [],
        [IDL.Vec(BodyMeasurements)],
        ['query'],
      ),
    'getBurnedCalorieEntries' : IDL.Func(
        [],
        [IDL.Vec(BurnedCalorieEntry)],
        ['query'],
      ),
    'getBurnedCalorieSummary' : IDL.Func([], [BurnedCalorieSummary], ['query']),
    'getCallerUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
    'getCallerUserRole' : IDL.Func([], [UserRole], ['query']),
    'getCalorieEntries' : IDL.Func([], [IDL.Vec(CalorieEntry)], ['query']),
    'getCurrentDayInfo' : IDL.Func([], [DayInfo], ['query']),
    'getDailyChecklists' : IDL.Func([], [IDL.Vec(DailyChecklist)], ['query']),
    'getDailyMotivationalSaying' : IDL.Func(
        [],
        [MotivationalSaying],
        ['query'],
      ),
    'getFileReference' : IDL.Func([IDL.Text], [FileReference], ['query']),
    'getMoodEnergyLogs' : IDL.Func([], [IDL.Vec(MoodEnergyLog)], ['query']),
    'getMotivationalMessages' : IDL.Func(
        [],
        [IDL.Vec(MotivationalMessage)],
        ['query'],
      ),
    'getProgressData' : IDL.Func([], [ProgressData], ['query']),
    'getProgressPhotos' : IDL.Func([], [IDL.Vec(ProgressPhoto)], ['query']),
    'getProgressSummaries' : IDL.Func(
        [],
        [IDL.Vec(ProgressSummary)],
        ['query'],
      ),
    'getStreakData' : IDL.Func([], [StreakData], ['query']),
    'getUserProfile' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(UserProfile)],
        ['query'],
      ),
    'getWeeklyExercisePlans' : IDL.Func(
        [],
        [IDL.Vec(WeeklyExercisePlan)],
        ['query'],
      ),
    'getWeightRecords' : IDL.Func([], [IDL.Vec(WeightRecord)], ['query']),
    'initializeAccessControl' : IDL.Func([], [], []),
    'isCallerAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'listFileReferences' : IDL.Func([], [IDL.Vec(FileReference)], ['query']),
    'registerFileReference' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'saveCallerUserProfile' : IDL.Func([UserProfile], [], []),
    'toggleExerciseCompletion' : IDL.Func(
        [DayOfWeek, IDL.Text, IDL.Nat],
        [],
        [],
      ),
    'updateBodyMeasurement' : IDL.Func([IDL.Nat, BodyMeasurements], [], []),
    'updateCalorieEntry' : IDL.Func([IDL.Nat, CalorieEntry], [], []),
    'updateWeightRecord' : IDL.Func([IDL.Nat, WeightRecord], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
