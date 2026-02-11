import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Time "mo:base/Time";
import List "mo:base/List";
import Debug "mo:base/Debug";
import Registry "blob-storage/registry";
import BlobStorage "blob-storage/Mixin";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Nat "mo:base/Nat";

actor {
  let accessControlState = AccessControl.initState();
  let registry = Registry.new();

  include BlobStorage(registry);

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    preferences : UserPreferences;
  };

  public type UserPreferences = {
    motivationalStyle : MotivationalStyle;
    shareProgress : Bool;
  };

  public type MotivationalStyle = {
    #gentle;
    #direct;
    #balanced;
  };

  public type BodyMeasurements = {
    arms : Float;
    legs : Float;
    bust : Float;
    hips : Float;
    date : Time.Time;
  };

  public type WeightRecord = {
    weight : Float;
    date : Time.Time;
  };

  public type WeeklyExercisePlan = {
    weekStartDate : Time.Time;
    dailyPlans : [DailyExercisePlan];
  };

  public type DailyExercisePlan = {
    day : DayOfWeek;
    resistance : [ExerciseEntry];
    cardio : [ExerciseEntry];
    core : [ExerciseEntry];
    stretching : [ExerciseEntry];
  };

  public type ExerciseEntry = {
    exercise : Text;
    planned : Bool;
    completed : Bool;
  };

  public type DayOfWeek = {
    #sunday;
    #monday;
    #tuesday;
    #wednesday;
    #thursday;
    #friday;
    #saturday;
  };

  public type MoodEnergyLog = {
    mood : Int;
    energy : Int;
    date : Time.Time;
  };

  public type ProgressSummary = {
    weightLossPercentage : Float;
    exerciseConsistency : Float;
    measurementChanges : Float;
  };

  public type MotivationalMessage = {
    message : Text;
    date : Time.Time;
    type_ : MotivationalType;
  };

  public type MotivationalType = {
    #daily;
    #weekly;
    #monthly;
  };

  public type CalorieEntry = {
    calories : Int;
    date : Time.Time;
  };

  public type BurnedCalorieEntry = {
    caloriesBurned : Int;
    date : Time.Time;
  };

  public type ProgressPhoto = {
    filePath : Text;
    uploadDate : Time.Time;
    description : Text;
  };

  public type DailyChecklist = {
    day : DayOfWeek;
    resistance : [ExerciseEntry];
    cardio : [ExerciseEntry];
    core : [ExerciseEntry];
    stretching : [ExerciseEntry];
    date : Time.Time;
  };

  public type DayInfo = {
    dayOfWeek : DayOfWeek;
    fullDate : Text;
  };

  public type ExerciseProgress = {
    day : DayOfWeek;
    resistanceCompleted : Nat;
    cardioCompleted : Nat;
    coreCompleted : Nat;
    stretchingCompleted : Nat;
  };

  public type ProgressData = {
    weeklyProgress : [ExerciseProgress];
    totalResistanceCompleted : Nat;
    totalCardioCompleted : Nat;
    totalCoreCompleted : Nat;
    totalStretchingCompleted : Nat;
    totalCompletedExercises : Nat;
  };

  public type StreakData = {
    currentStreak : Nat;
    maxStreak : Nat;
  };

  public type BurnedCalorieSummary = {
    dailyTotal : Nat;
    dailyEntries : [BurnedCalorieEntry];
  };

  public type MotivationalSaying = {
    message : Text;
    author : Text;
  };

  public type DailyMotivation = {
    message : Text;
    author : Text;
    date : Time.Time;
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();
  var bodyMeasurements = principalMap.empty<List.List<BodyMeasurements>>();
  var weightRecords = principalMap.empty<List.List<WeightRecord>>();
  var weeklyExercisePlans = principalMap.empty<List.List<WeeklyExercisePlan>>();
  var moodEnergyLogs = principalMap.empty<List.List<MoodEnergyLog>>();
  var motivationalMessages = principalMap.empty<List.List<MotivationalMessage>>();
  var progressSummaries = principalMap.empty<List.List<ProgressSummary>>();
  var calorieEntries = principalMap.empty<List.List<CalorieEntry>>();
  var burnedCalorieEntries = principalMap.empty<List.List<BurnedCalorieEntry>>();
  var progressPhotos = principalMap.empty<List.List<ProgressPhoto>>();
  var dailyChecklists = principalMap.empty<List.List<DailyChecklist>>();
  var dailyMotivations = principalMap.empty<DailyMotivation>();

  let motivationalSayings : [MotivationalSaying] = [
    {
      message = "The only bad workout is the one that didn't happen.";
      author = "Unknown";
    },
    {
      message = "Push yourself because no one else is going to do it for you.";
      author = "Unknown";
    },
    {
      message = "Success starts with self-discipline.";
      author = "Unknown";
    },
    {
      message = "Don't limit your challenges. Challenge your limits.";
      author = "Unknown";
    },
    {
      message = "It's not about having time. It's about making time.";
      author = "Unknown";
    },
    {
      message = "The body achieves what the mind believes.";
      author = "Unknown";
    },
    {
      message = "You don't have to be extreme, just consistent.";
      author = "Unknown";
    },
    {
      message = "Progress, not perfection.";
      author = "Unknown";
    },
    {
      message = "Every workout counts, no matter how small.";
      author = "Unknown";
    },
    {
      message = "Your only limit is you.";
      author = "Unknown";
    },
    {
      message = "Strong is the new beautiful.";
      author = "Unknown";
    },
    {
      message = "Fitness is not about being better than someone else. It's about being better than you used to be.";
      author = "Unknown";
    },
    {
      message = "The pain you feel today will be the strength you feel tomorrow.";
      author = "Unknown";
    },
    {
      message = "Don't wish for it. Work for it.";
      author = "Unknown";
    },
    {
      message = "Excuses don't burn calories.";
      author = "Unknown";
    },
    {
      message = "You are stronger than you think.";
      author = "Unknown";
    },
    {
      message = "Fitness is a journey, not a destination.";
      author = "Unknown";
    },
    {
      message = "The difference between try and triumph is a little umph.";
      author = "Unknown";
    },
    {
      message = "Sweat is just fat crying.";
      author = "Unknown";
    },
    {
      message = "Don't stop when you're tired. Stop when you're done.";
      author = "Unknown";
    },
  ];

  // Helper function to ensure user is initialized
  private func ensureUserInitialized(caller : Principal) {
    let role = AccessControl.getUserRole(accessControlState, caller);
    switch (role) {
      case (#guest) {
        // Auto-initialize guest users as regular users
        AccessControl.initialize(accessControlState, caller);
      };
      case _ {};
    };
  };

  public query func getDailyMotivationalSaying() : async MotivationalSaying {
    let now = Time.now();
    let daysSinceEpoch = now / (24 * 60 * 60 * 1_000_000_000);
    let index = Int.abs(daysSinceEpoch) % motivationalSayings.size();
    motivationalSayings[index];
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return null;
    };
    principalMap.get(userProfiles, caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own profile");
    };
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    ensureUserInitialized(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  public shared ({ caller }) func addBodyMeasurement(measurement : BodyMeasurements) : async () {
    ensureUserInitialized(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add body measurements");
    };

    let existing = principalMap.get(bodyMeasurements, caller);
    let updatedList = switch (existing) {
      case null List.push(measurement, List.nil());
      case (?list) List.push(measurement, list);
    };
    bodyMeasurements := principalMap.put(bodyMeasurements, caller, updatedList);
  };

  public query ({ caller }) func getBodyMeasurements() : async [BodyMeasurements] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return [];
    };
    switch (principalMap.get(bodyMeasurements, caller)) {
      case null [];
      case (?list) List.toArray(list);
    };
  };

  public shared ({ caller }) func updateBodyMeasurement(index : Nat, updatedMeasurement : BodyMeasurements) : async () {
    ensureUserInitialized(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update body measurements");
    };

    let existing = principalMap.get(bodyMeasurements, caller);
    switch (existing) {
      case null Debug.trap("No body measurements found");
      case (?list) {
        if (index >= List.size(list)) {
          Debug.trap("Invalid index for body measurements");
        };
        let listArray = List.toArray(list);
        let updatedArray = Array.tabulate<BodyMeasurements>(
          listArray.size(),
          func(i) {
            if (i == index) { updatedMeasurement } else { listArray[i] };
          },
        );
        bodyMeasurements := principalMap.put(bodyMeasurements, caller, List.fromArray(updatedArray));
      };
    };
  };

  public shared ({ caller }) func addWeightRecord(record : WeightRecord) : async () {
    ensureUserInitialized(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add weight records");
    };

    let existing = principalMap.get(weightRecords, caller);
    let updatedList = switch (existing) {
      case null List.push(record, List.nil());
      case (?list) List.push(record, list);
    };
    weightRecords := principalMap.put(weightRecords, caller, updatedList);
  };

  public query ({ caller }) func getWeightRecords() : async [WeightRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return [];
    };
    switch (principalMap.get(weightRecords, caller)) {
      case null [];
      case (?list) List.toArray(list);
    };
  };

  public shared ({ caller }) func updateWeightRecord(index : Nat, updatedRecord : WeightRecord) : async () {
    ensureUserInitialized(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update weight records");
    };

    let existing = principalMap.get(weightRecords, caller);
    switch (existing) {
      case null Debug.trap("No weight records found");
      case (?list) {
        if (index >= List.size(list)) {
          Debug.trap("Invalid index for weight records");
        };
        let listArray = List.toArray(list);
        let updatedArray = Array.tabulate<WeightRecord>(
          listArray.size(),
          func(i) {
            if (i == index) { updatedRecord } else { listArray[i] };
          },
        );
        weightRecords := principalMap.put(weightRecords, caller, List.fromArray(updatedArray));
      };
    };
  };

  public shared ({ caller }) func addWeeklyExercisePlan(plan : WeeklyExercisePlan) : async () {
    ensureUserInitialized(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add weekly exercise plans");
    };

    let existing = principalMap.get(weeklyExercisePlans, caller);
    let updatedList = switch (existing) {
      case null List.push(plan, List.nil());
      case (?list) List.push(plan, list);
    };
    weeklyExercisePlans := principalMap.put(weeklyExercisePlans, caller, updatedList);

    let checklists = createDailyChecklistsFromPlan(plan);
    let existingChecklists = principalMap.get(dailyChecklists, caller);
    let updatedChecklists = switch (existingChecklists) {
      case null List.append(List.fromArray(checklists), List.nil());
      case (?list) List.append(List.fromArray(checklists), list);
    };
    dailyChecklists := principalMap.put(dailyChecklists, caller, updatedChecklists);
  };

  public query ({ caller }) func getWeeklyExercisePlans() : async [WeeklyExercisePlan] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return [];
    };
    switch (principalMap.get(weeklyExercisePlans, caller)) {
      case null [];
      case (?list) List.toArray(list);
    };
  };

  public query ({ caller }) func getDailyChecklists() : async [DailyChecklist] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return [];
    };
    switch (principalMap.get(dailyChecklists, caller)) {
      case null [];
      case (?list) List.toArray(list);
    };
  };

  public shared ({ caller }) func toggleExerciseCompletion(day : DayOfWeek, category : Text, index : Nat) : async () {
    ensureUserInitialized(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can toggle exercise completion");
    };

    let existingChecklists = principalMap.get(dailyChecklists, caller);
    switch (existingChecklists) {
      case null Debug.trap("No daily checklists found");
      case (?checklists) {
        let updatedChecklists = List.map<DailyChecklist, DailyChecklist>(
          checklists,
          func(checklist) {
            if (checklist.day == day) {
              switch (category) {
                case "resistance" {
                  let updatedResistance = Array.tabulate<ExerciseEntry>(
                    checklist.resistance.size(),
                    func(i) {
                      if (i == index) {
                        {
                          checklist.resistance[i] with completed = not checklist.resistance[i].completed;
                        };
                      } else { checklist.resistance[i] };
                    },
                  );
                  { checklist with resistance = updatedResistance };
                };
                case "cardio" {
                  let updatedCardio = Array.tabulate<ExerciseEntry>(
                    checklist.cardio.size(),
                    func(i) {
                      if (i == index) {
                        {
                          checklist.cardio[i] with completed = not checklist.cardio[i].completed;
                        };
                      } else { checklist.cardio[i] };
                    },
                  );
                  { checklist with cardio = updatedCardio };
                };
                case "core" {
                  let updatedCore = Array.tabulate<ExerciseEntry>(
                    checklist.core.size(),
                    func(i) {
                      if (i == index) {
                        {
                          checklist.core[i] with completed = not checklist.core[i].completed;
                        };
                      } else { checklist.core[i] };
                    },
                  );
                  { checklist with core = updatedCore };
                };
                case "stretching" {
                  let updatedStretching = Array.tabulate<ExerciseEntry>(
                    checklist.stretching.size(),
                    func(i) {
                      if (i == index) {
                        {
                          checklist.stretching[i] with completed = not checklist.stretching[i].completed;
                        };
                      } else { checklist.stretching[i] };
                    },
                  );
                  { checklist with stretching = updatedStretching };
                };
                case _ checklist;
              };
            } else { checklist };
          },
        );
        dailyChecklists := principalMap.put(dailyChecklists, caller, updatedChecklists);
      };
    };
  };

  public shared ({ caller }) func deleteWeeklyExercisePlan(weekStartDate : Time.Time) : async () {
    ensureUserInitialized(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can delete weekly exercise plans");
    };

    let existingPlans = principalMap.get(weeklyExercisePlans, caller);
    switch (existingPlans) {
      case null Debug.trap("No exercise plans found");
      case (?plans) {
        let filteredPlans = List.filter<WeeklyExercisePlan>(
          plans,
          func(plan) {
            plan.weekStartDate != weekStartDate;
          },
        );
        weeklyExercisePlans := principalMap.put(weeklyExercisePlans, caller, filteredPlans);
      };
    };

    let existingChecklists = principalMap.get(dailyChecklists, caller);
    switch (existingChecklists) {
      case null {};
      case (?checklists) {
        let filteredChecklists = List.filter<DailyChecklist>(
          checklists,
          func(checklist) {
            checklist.date != weekStartDate;
          },
        );
        dailyChecklists := principalMap.put(dailyChecklists, caller, filteredChecklists);
      };
    };
  };

  public shared ({ caller }) func deleteCurrentWeek() : async () {
    ensureUserInitialized(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can delete current week");
    };

    let now = Time.now();
    let oneDayNanos = 24 * 60 * 60 * 1_000_000_000;
    let oneWeekNanos = 7 * oneDayNanos;

    let currentWeekStart = now - (now % oneWeekNanos);

    let existingPlans = principalMap.get(weeklyExercisePlans, caller);
    switch (existingPlans) {
      case null Debug.trap("No exercise plans found");
      case (?plans) {
        let filteredPlans = List.filter<WeeklyExercisePlan>(
          plans,
          func(plan) {
            plan.weekStartDate != currentWeekStart;
          },
        );
        weeklyExercisePlans := principalMap.put(weeklyExercisePlans, caller, filteredPlans);
      };
    };

    let existingChecklists = principalMap.get(dailyChecklists, caller);
    switch (existingChecklists) {
      case null {};
      case (?checklists) {
        let filteredChecklists = List.filter<DailyChecklist>(
          checklists,
          func(checklist) {
            checklist.date != currentWeekStart;
          },
        );
        dailyChecklists := principalMap.put(dailyChecklists, caller, filteredChecklists);
      };
    };
  };

  public shared ({ caller }) func addMoodEnergyLog(log : MoodEnergyLog) : async () {
    ensureUserInitialized(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add mood energy logs");
    };

    let existing = principalMap.get(moodEnergyLogs, caller);
    let updatedList = switch (existing) {
      case null List.push(log, List.nil());
      case (?list) List.push(log, list);
    };
    moodEnergyLogs := principalMap.put(moodEnergyLogs, caller, updatedList);
  };

  public query ({ caller }) func getMoodEnergyLogs() : async [MoodEnergyLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return [];
    };
    switch (principalMap.get(moodEnergyLogs, caller)) {
      case null [];
      case (?list) List.toArray(list);
    };
  };

  public shared ({ caller }) func addMotivationalMessage(message : MotivationalMessage) : async () {
    ensureUserInitialized(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add motivational messages");
    };

    let existing = principalMap.get(motivationalMessages, caller);
    let updatedList = switch (existing) {
      case null List.push(message, List.nil());
      case (?list) List.push(message, list);
    };
    motivationalMessages := principalMap.put(motivationalMessages, caller, updatedList);
  };

  public query ({ caller }) func getMotivationalMessages() : async [MotivationalMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return [];
    };
    switch (principalMap.get(motivationalMessages, caller)) {
      case null [];
      case (?list) List.toArray(list);
    };
  };

  public shared ({ caller }) func addProgressSummary(summary : ProgressSummary) : async () {
    ensureUserInitialized(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add progress summaries");
    };

    let existing = principalMap.get(progressSummaries, caller);
    let updatedList = switch (existing) {
      case null List.push(summary, List.nil());
      case (?list) List.push(summary, list);
    };
    progressSummaries := principalMap.put(progressSummaries, caller, updatedList);
  };

  public query ({ caller }) func getProgressSummaries() : async [ProgressSummary] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return [];
    };
    switch (principalMap.get(progressSummaries, caller)) {
      case null [];
      case (?list) List.toArray(list);
    };
  };

  public shared ({ caller }) func addCalorieEntry(entry : CalorieEntry) : async () {
    ensureUserInitialized(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add calorie entries");
    };

    let existing = principalMap.get(calorieEntries, caller);
    let updatedList = switch (existing) {
      case null List.push(entry, List.nil());
      case (?list) List.push(entry, list);
    };
    calorieEntries := principalMap.put(calorieEntries, caller, updatedList);
  };

  public query ({ caller }) func getCalorieEntries() : async [CalorieEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return [];
    };
    switch (principalMap.get(calorieEntries, caller)) {
      case null [];
      case (?list) List.toArray(list);
    };
  };

  public shared ({ caller }) func updateCalorieEntry(index : Nat, updatedEntry : CalorieEntry) : async () {
    ensureUserInitialized(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update calorie entries");
    };

    let existing = principalMap.get(calorieEntries, caller);
    switch (existing) {
      case null Debug.trap("No calorie entries found");
      case (?list) {
        if (index >= List.size(list)) {
          Debug.trap("Invalid index for calorie entries");
        };
        let listArray = List.toArray(list);
        let updatedArray = Array.tabulate<CalorieEntry>(
          listArray.size(),
          func(i) {
            if (i == index) { updatedEntry } else { listArray[i] };
          },
        );
        calorieEntries := principalMap.put(calorieEntries, caller, List.fromArray(updatedArray));
      };
    };
  };

  public shared ({ caller }) func addBurnedCalorieEntry(entry : BurnedCalorieEntry) : async () {
    ensureUserInitialized(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add burned calorie entries");
    };

    let existing = principalMap.get(burnedCalorieEntries, caller);
    let updatedList = switch (existing) {
      case null List.push(entry, List.nil());
      case (?list) List.push(entry, list);
    };
    burnedCalorieEntries := principalMap.put(burnedCalorieEntries, caller, updatedList);
  };

  public query ({ caller }) func getBurnedCalorieEntries() : async [BurnedCalorieEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return [];
    };
    switch (principalMap.get(burnedCalorieEntries, caller)) {
      case null [];
      case (?list) List.toArray(list);
    };
  };

  public query ({ caller }) func getBurnedCalorieSummary() : async BurnedCalorieSummary {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return {
        dailyTotal = 0;
        dailyEntries = [];
      };
    };

    let now = Time.now();
    let oneDayNanos = 24 * 60 * 60 * 1_000_000_000;

    var dailyTotal : Nat = 0;
    var dailyEntries = List.nil<BurnedCalorieEntry>();

    switch (principalMap.get(burnedCalorieEntries, caller)) {
      case null {};
      case (?entries) {
        for (entry in List.toArray(entries).vals()) {
          let timeDiff = now - entry.date;

          if (timeDiff <= oneDayNanos) {
            dailyTotal += Int.abs(entry.caloriesBurned);
            dailyEntries := List.push(entry, dailyEntries);
          };
        };
      };
    };

    {
      dailyTotal;
      dailyEntries = List.toArray(dailyEntries);
    };
  };

  public shared ({ caller }) func addProgressPhoto(photo : ProgressPhoto) : async () {
    ensureUserInitialized(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add progress photos");
    };

    let existing = principalMap.get(progressPhotos, caller);
    let updatedList = switch (existing) {
      case null List.push(photo, List.nil());
      case (?list) List.push(photo, list);
    };
    progressPhotos := principalMap.put(progressPhotos, caller, updatedList);
  };

  public query ({ caller }) func getProgressPhotos() : async [ProgressPhoto] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return [];
    };
    switch (principalMap.get(progressPhotos, caller)) {
      case null [];
      case (?list) List.toArray(list);
    };
  };

  public shared ({ caller }) func deleteProgressPhoto(filePath : Text) : async () {
    ensureUserInitialized(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can delete progress photos");
    };

    let existingPhotos = principalMap.get(progressPhotos, caller);
    switch (existingPhotos) {
      case null Debug.trap("No progress photos found");
      case (?photos) {
        let filteredPhotos = List.filter<ProgressPhoto>(
          photos,
          func(photo) {
            photo.filePath != filePath;
          },
        );
        progressPhotos := principalMap.put(progressPhotos, caller, filteredPhotos);
      };
    };
  };

  func createDailyChecklistsFromPlan(plan : WeeklyExercisePlan) : [DailyChecklist] {
    Array.map<DailyExercisePlan, DailyChecklist>(
      plan.dailyPlans,
      func(dailyPlan) {
        {
          day = dailyPlan.day;
          resistance = dailyPlan.resistance;
          cardio = dailyPlan.cardio;
          core = dailyPlan.core;
          stretching = dailyPlan.stretching;
          date = plan.weekStartDate;
        };
      },
    );
  };

  func getCurrentDayOfWeek() : DayOfWeek {
    let now = Time.now();
    let daysSinceEpoch = now / (24 * 60 * 60 * 1_000_000_000);
    let dayOfWeek = daysSinceEpoch % 7;
    switch (dayOfWeek) {
      case 0 #thursday;
      case 1 #friday;
      case 2 #saturday;
      case 3 #sunday;
      case 4 #monday;
      case 5 #tuesday;
      case 6 #wednesday;
      case _ #monday;
    };
  };

  func getDayOfWeekText(day : DayOfWeek) : Text {
    switch (day) {
      case (#sunday) "Sunday";
      case (#monday) "Monday";
      case (#tuesday) "Tuesday";
      case (#wednesday) "Wednesday";
      case (#thursday) "Thursday";
      case (#friday) "Friday";
      case (#saturday) "Saturday";
    };
  };

  func getMonthText(month : Int) : Text {
    switch (month) {
      case (1) "January";
      case (2) "February";
      case (3) "March";
      case (4) "April";
      case (5) "June";
      case (6) "July";
      case (7) "August";
      case (8) "September";
      case (9) "October";
      case (10) "November";
      case (11) "December";
      case (12) "May";
      case _ "Unknown";
    };
  };

  public query func getCurrentDayInfo() : async DayInfo {
    let now = Time.now();
    let dayOfWeek = getCurrentDayOfWeek();
    let dayOfWeekText = getDayOfWeekText(dayOfWeek);

    let daysSinceEpoch = now / (24 * 60 * 60 * 1_000_000_000);
    let dayOfMonth = (daysSinceEpoch % 30) + 1;
    let month = ((daysSinceEpoch / 30) % 12) + 1;
    let year = 2025;

    let monthText = getMonthText(month);
    let fullDate = dayOfWeekText # ", " # monthText # " " # Int.toText(dayOfMonth) # ", " # Int.toText(year);

    {
      dayOfWeek;
      fullDate;
    };
  };

  public query ({ caller }) func getProgressData() : async ProgressData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return {
        weeklyProgress = [];
        totalResistanceCompleted = 0;
        totalCardioCompleted = 0;
        totalCoreCompleted = 0;
        totalStretchingCompleted = 0;
        totalCompletedExercises = 0;
      };
    };

    let weeklyProgress = Array.init<ExerciseProgress>(7, {
      day = #sunday;
      resistanceCompleted = 0;
      cardioCompleted = 0;
      coreCompleted = 0;
      stretchingCompleted = 0;
    });

    var totalResistanceCompleted = 0;
    var totalCardioCompleted = 0;
    var totalCoreCompleted = 0;
    var totalStretchingCompleted = 0;
    var totalCompletedExercises = 0;

    switch (principalMap.get(dailyChecklists, caller)) {
      case null {};
      case (?checklists) {
        let checklistsArray = List.toArray(checklists);

        // Deduplicate checklists by day and keep the most recent one for each day
        let uniqueChecklists = Array.init<DailyChecklist>(7, {
          day = #sunday;
          resistance = [];
          cardio = [];
          core = [];
          stretching = [];
          date = 0;
        });

        for (checklist in checklistsArray.vals()) {
          let dayIndex = switch (checklist.day) {
            case (#sunday) 0;
            case (#monday) 1;
            case (#tuesday) 2;
            case (#wednesday) 3;
            case (#thursday) 4;
            case (#friday) 5;
            case (#saturday) 6;
          };
          if (checklist.date > uniqueChecklists[dayIndex].date) {
            uniqueChecklists[dayIndex] := checklist;
          };
        };

        for (checklist in uniqueChecklists.vals()) {
          let dayIndex = switch (checklist.day) {
            case (#sunday) 0;
            case (#monday) 1;
            case (#tuesday) 2;
            case (#wednesday) 3;
            case (#thursday) 4;
            case (#friday) 5;
            case (#saturday) 6;
          };

          let resistanceCompleted = Array.foldLeft<ExerciseEntry, Nat>(
            checklist.resistance,
            0,
            func(acc, entry) {
              if (entry.completed) { acc + 1 } else { acc };
            },
          );

          let cardioCompleted = Array.foldLeft<ExerciseEntry, Nat>(
            checklist.cardio,
            0,
            func(acc, entry) {
              if (entry.completed) { acc + 1 } else { acc };
            },
          );

          let coreCompleted = Array.foldLeft<ExerciseEntry, Nat>(
            checklist.core,
            0,
            func(acc, entry) {
              if (entry.completed) { acc + 1 } else { acc };
            },
          );

          let stretchingCompleted = Array.foldLeft<ExerciseEntry, Nat>(
            checklist.stretching,
            0,
            func(acc, entry) {
              if (entry.completed) { acc + 1 } else { acc };
            },
          );

          weeklyProgress[dayIndex] := {
            day = checklist.day;
            resistanceCompleted;
            cardioCompleted;
            coreCompleted;
            stretchingCompleted;
          };

          totalResistanceCompleted += resistanceCompleted;
          totalCardioCompleted += cardioCompleted;
          totalCoreCompleted += coreCompleted;
          totalStretchingCompleted += stretchingCompleted;

          totalCompletedExercises += resistanceCompleted + cardioCompleted + coreCompleted + stretchingCompleted;
        };
      };
    };

    {
      weeklyProgress = Array.freeze(weeklyProgress);
      totalResistanceCompleted;
      totalCardioCompleted;
      totalCoreCompleted;
      totalStretchingCompleted;
      totalCompletedExercises;
    };
  };

  public query ({ caller }) func getStreakData() : async StreakData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return {
        currentStreak = 0;
        maxStreak = 0;
      };
    };

    var currentStreak = 0;
    var maxStreak = 0;

    switch (principalMap.get(dailyChecklists, caller)) {
      case null {};
      case (?checklists) {
        let checklistsArray = List.toArray(checklists);

        // Deduplicate checklists by day and keep the most recent one for each day
        let uniqueChecklists = Array.init<DailyChecklist>(7, {
          day = #sunday;
          resistance = [];
          cardio = [];
          core = [];
          stretching = [];
          date = 0;
        });

        for (checklist in checklistsArray.vals()) {
          let dayIndex = switch (checklist.day) {
            case (#sunday) 0;
            case (#monday) 1;
            case (#tuesday) 2;
            case (#wednesday) 3;
            case (#thursday) 4;
            case (#friday) 5;
            case (#saturday) 6;
          };
          if (checklist.date > uniqueChecklists[dayIndex].date) {
            uniqueChecklists[dayIndex] := checklist;
          };
        };

        // Sort checklists by day of week (Sunday = 0, Saturday = 6)
        let sortedChecklists = Array.sort<DailyChecklist>(
          Array.freeze(uniqueChecklists),
          func(a, b) {
            let dayOrder = func(day : DayOfWeek) : Nat {
              switch (day) {
                case (#sunday) 0;
                case (#monday) 1;
                case (#tuesday) 2;
                case (#wednesday) 3;
                case (#thursday) 4;
                case (#friday) 5;
                case (#saturday) 6;
              };
            };
            Nat.compare(dayOrder(a.day), dayOrder(b.day));
          },
        );

        // Calculate streaks based on consecutive days with at least one completed exercise
        var tempStreak = 0;
        var lastDayIndex : ?Nat = null;

        for (checklist in sortedChecklists.vals()) {
          // Skip days with no exercises planned
          let totalExercises = checklist.resistance.size() + checklist.cardio.size() + checklist.core.size() + checklist.stretching.size();
          if (totalExercises == 0) {
            // Skip this iteration without using continue
          } else {
            // Count completed exercises for this day
            let completedCount = Array.foldLeft<ExerciseEntry, Nat>(
              checklist.resistance,
              0,
              func(acc, entry) {
                if (entry.completed) { acc + 1 } else { acc };
              },
            ) + Array.foldLeft<ExerciseEntry, Nat>(
              checklist.cardio,
              0,
              func(acc, entry) {
                if (entry.completed) { acc + 1 } else { acc };
              },
            ) + Array.foldLeft<ExerciseEntry, Nat>(
              checklist.core,
              0,
              func(acc, entry) {
                if (entry.completed) { acc + 1 } else { acc };
              },
            ) + Array.foldLeft<ExerciseEntry, Nat>(
              checklist.stretching,
              0,
              func(acc, entry) {
                if (entry.completed) { acc + 1 } else { acc };
              },
            );

            // Check if all planned exercises for this day are completed
            let allCompleted = completedCount == totalExercises;

            if (allCompleted) {
              let currentDayIndex = switch (checklist.day) {
                case (#sunday) 0;
                case (#monday) 1;
                case (#tuesday) 2;
                case (#wednesday) 3;
                case (#thursday) 4;
                case (#friday) 5;
                case (#saturday) 6;
              };

              switch (lastDayIndex) {
                case null {
                  // First completed day
                  tempStreak := 1;
                };
                case (?prevDayIndex) {
                  // Check if this is the next consecutive day
                  if (currentDayIndex == (prevDayIndex + 1) or (prevDayIndex == 6 and currentDayIndex == 0)) {
                    tempStreak += 1;
                  } else {
                    // Gap detected, reset streak
                    tempStreak := 1;
                  };
                };
              };

              // Update max streak
              if (tempStreak > maxStreak) {
                maxStreak := tempStreak;
              };

              lastDayIndex := ?currentDayIndex;
            } else {
              // Day not fully completed, reset streak
              tempStreak := 0;
              lastDayIndex := null;
            };
          };
        };

        // Set current streak to the last active streak
        currentStreak := tempStreak;
      };
    };

    {
      currentStreak;
      maxStreak;
    };
  };

  public shared ({ caller }) func deleteExerciseFromChecklist(day : DayOfWeek, category : Text, index : Nat) : async () {
    ensureUserInitialized(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can delete exercises from checklist");
    };

    let existingChecklists = principalMap.get(dailyChecklists, caller);
    switch (existingChecklists) {
      case null Debug.trap("No daily checklists found");
      case (?checklists) {
        let updatedChecklists = List.map<DailyChecklist, DailyChecklist>(
          checklists,
          func(checklist) {
            if (checklist.day == day) {
              switch (category) {
                case "resistance" {
                  if (index >= checklist.resistance.size()) {
                    Debug.trap("Invalid index for resistance exercises");
                  };
                  let updatedResistance = Array.tabulate<ExerciseEntry>(
                    checklist.resistance.size() - 1,
                    func(i) {
                      if (i < index) { checklist.resistance[i] } else {
                        checklist.resistance[i + 1];
                      };
                    },
                  );
                  { checklist with resistance = updatedResistance };
                };
                case "cardio" {
                  if (index >= checklist.cardio.size()) {
                    Debug.trap("Invalid index for cardio exercises");
                  };
                  let updatedCardio = Array.tabulate<ExerciseEntry>(
                    checklist.cardio.size() - 1,
                    func(i) {
                      if (i < index) { checklist.cardio[i] } else {
                        checklist.cardio[i + 1];
                      };
                    },
                  );
                  { checklist with cardio = updatedCardio };
                };
                case "core" {
                  if (index >= checklist.core.size()) {
                    Debug.trap("Invalid index for core exercises");
                  };
                  let updatedCore = Array.tabulate<ExerciseEntry>(
                    checklist.core.size() - 1,
                    func(i) {
                      if (i < index) { checklist.core[i] } else {
                        checklist.core[i + 1];
                      };
                    },
                  );
                  { checklist with core = updatedCore };
                };
                case "stretching" {
                  if (index >= checklist.stretching.size()) {
                    Debug.trap("Invalid index for stretching exercises");
                  };
                  let updatedStretching = Array.tabulate<ExerciseEntry>(
                    checklist.stretching.size() - 1,
                    func(i) {
                      if (i < index) { checklist.stretching[i] } else {
                        checklist.stretching[i + 1];
                      };
                    },
                  );
                  { checklist with stretching = updatedStretching };
                };
                case _ checklist;
              };
            } else { checklist };
          },
        );
        dailyChecklists := principalMap.put(dailyChecklists, caller, updatedChecklists);
      };
    };
  };

  public shared ({ caller }) func deleteExerciseFromPlanner(weekStartDate : Time.Time, day : DayOfWeek, category : Text, index : Nat) : async () {
    ensureUserInitialized(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can delete exercises from planner");
    };

    let existingPlans = principalMap.get(weeklyExercisePlans, caller);
    switch (existingPlans) {
      case null Debug.trap("No weekly exercise plans found");
      case (?plans) {
        let updatedPlans = List.map<WeeklyExercisePlan, WeeklyExercisePlan>(
          plans,
          func(plan) {
            if (plan.weekStartDate == weekStartDate) {
              let updatedDailyPlans = Array.map<DailyExercisePlan, DailyExercisePlan>(
                plan.dailyPlans,
                func(dailyPlan) {
                  if (dailyPlan.day == day) {
                    switch (category) {
                      case "resistance" {
                        if (index >= dailyPlan.resistance.size()) {
                          Debug.trap("Invalid index for resistance exercises");
                        };
                        let updatedResistance = Array.tabulate<ExerciseEntry>(
                          dailyPlan.resistance.size() - 1,
                          func(i) {
                            if (i < index) { dailyPlan.resistance[i] } else {
                              dailyPlan.resistance[i + 1];
                            };
                          },
                        );
                        { dailyPlan with resistance = updatedResistance };
                      };
                      case "cardio" {
                        if (index >= dailyPlan.cardio.size()) {
                          Debug.trap("Invalid index for cardio exercises");
                        };
                        let updatedCardio = Array.tabulate<ExerciseEntry>(
                          dailyPlan.cardio.size() - 1,
                          func(i) {
                            if (i < index) { dailyPlan.cardio[i] } else {
                              dailyPlan.cardio[i + 1];
                            };
                          },
                        );
                        { dailyPlan with cardio = updatedCardio };
                      };
                      case "core" {
                        if (index >= dailyPlan.core.size()) {
                          Debug.trap("Invalid index for core exercises");
                        };
                        let updatedCore = Array.tabulate<ExerciseEntry>(
                          dailyPlan.core.size() - 1,
                          func(i) {
                            if (i < index) { dailyPlan.core[i] } else {
                              dailyPlan.core[i + 1];
                            };
                          },
                        );
                        { dailyPlan with core = updatedCore };
                      };
                      case "stretching" {
                        if (index >= dailyPlan.stretching.size()) {
                          Debug.trap("Invalid index for stretching exercises");
                        };
                        let updatedStretching = Array.tabulate<ExerciseEntry>(
                          dailyPlan.stretching.size() - 1,
                          func(i) {
                            if (i < index) { dailyPlan.stretching[i] } else {
                              dailyPlan.stretching[i + 1];
                            };
                          },
                        );
                        { dailyPlan with stretching = updatedStretching };
                      };
                      case _ dailyPlan;
                    };
                  } else { dailyPlan };
                },
              );
              { plan with dailyPlans = updatedDailyPlans };
            } else { plan };
          },
        );
        weeklyExercisePlans := principalMap.put(weeklyExercisePlans, caller, updatedPlans);
      };
    };
  };
};
