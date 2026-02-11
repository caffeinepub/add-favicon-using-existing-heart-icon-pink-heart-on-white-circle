import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetWeightRecords, useGetBodyMeasurements, useGetCalorieEntries, useGetBurnedCalorieEntries, useGetProgressData, useGetStreakData } from '../hooks/useQueries';
import { TrendingDown, Activity, Ruler, Calendar, Flame, Award, Target, Apple } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, Cell } from 'recharts';

interface DayData {
  date: string;
  resistance: number;
  cardio: number;
  core: number;
  stretching: number;
}

export default function ProgressView() {
  const { data: weightRecords = [] } = useGetWeightRecords();
  const { data: measurements = [] } = useGetBodyMeasurements();
  const { data: calorieEntries = [] } = useGetCalorieEntries();
  const { data: burnedCalorieEntries = [] } = useGetBurnedCalorieEntries();
  const { data: progressData } = useGetProgressData();
  const { data: streakData } = useGetStreakData();

  const currentStreak = streakData ? Number(streakData.currentStreak) : 0;
  const maxStreak = streakData ? Number(streakData.maxStreak) : 0;

  // Calculate daily completion data from backend progress data
  const getDailyCompletionData = (): DayData[] => {
    if (!progressData) return [];
    
    return progressData.weeklyProgress.map((dayProgress) => {
      const dayName = dayProgress.day.charAt(0).toUpperCase() + dayProgress.day.slice(1);
      return {
        date: dayName.slice(0, 3), // Mon, Tue, etc.
        resistance: Number(dayProgress.resistanceCompleted),
        cardio: Number(dayProgress.cardioCompleted),
        core: Number(dayProgress.coreCompleted),
        stretching: Number(dayProgress.stretchingCompleted),
      };
    });
  };

  const dailyData = getDailyCompletionData();

  // Calculate weight loss stats
  const firstWeight = weightRecords[0];
  const latestWeight = weightRecords[weightRecords.length - 1];
  const totalWeightLoss = firstWeight && latestWeight ? firstWeight.weight - latestWeight.weight : 0;
  const weightLossPercentage = firstWeight && totalWeightLoss > 0 ? (totalWeightLoss / firstWeight.weight) * 100 : 0;

  // Calculate calorie stats
  const averageCalories = calorieEntries.length > 0
    ? calorieEntries.reduce((sum, entry) => sum + Number(entry.calories), 0) / calorieEntries.length
    : 0;

  const averageBurnedCalories = burnedCalorieEntries.length > 0
    ? burnedCalorieEntries.reduce((sum, entry) => sum + Number(entry.caloriesBurned), 0) / burnedCalorieEntries.length
    : 0;

  // Get total completed exercises from backend progress data
  const totalCompletedExercises = progressData ? Number(progressData.totalCompletedExercises) : 0;

  // Calculate measurement changes
  const firstMeasurement = measurements[0];
  const latestMeasurement = measurements[measurements.length - 1];

  // Prepare combined calorie chart data (last 30 days) with both intake and burned
  const combinedCalorieChartData = (() => {
    // Create a map of dates to calorie data
    const dateMap = new Map<string, { intake: number; burned: number }>();

    // Add intake data
    calorieEntries.slice(-30).forEach((entry) => {
      const dateStr = new Date(Number(entry.date / BigInt(1000000))).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const existing = dateMap.get(dateStr) || { intake: 0, burned: 0 };
      existing.intake = Number(entry.calories);
      dateMap.set(dateStr, existing);
    });

    // Add burned data
    burnedCalorieEntries.slice(-30).forEach((entry) => {
      const dateStr = new Date(Number(entry.date / BigInt(1000000))).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const existing = dateMap.get(dateStr) || { intake: 0, burned: 0 };
      existing.burned = Number(entry.caloriesBurned);
      dateMap.set(dateStr, existing);
    });

    // Convert to array and sort by date
    return Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date,
        intake: data.intake,
        burned: data.burned,
      }))
      .sort((a, b) => {
        // Simple date comparison for sorting
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
  })();

  // Prepare category totals data from backend progress data
  const categoryTotalsData = progressData ? [
    {
      category: 'Resistance',
      count: Number(progressData.totalResistanceCompleted),
    },
    {
      category: 'Cardio',
      count: Number(progressData.totalCardioCompleted),
    },
    {
      category: 'Core',
      count: Number(progressData.totalCoreCompleted),
    },
    {
      category: 'Stretching',
      count: Number(progressData.totalStretchingCompleted),
    },
  ] : [];

  const COLORS = [
    'oklch(0.828 0.189 84.429)', // Resistance - orange
    'oklch(0.646 0.222 41.116)', // Cardio - red
    'oklch(0.6 0.118 184.704)',   // Core - blue
    'oklch(0.769 0.188 70.08)',   // Stretching - purple
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-blue-500" />
              Weight Loss
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWeightLoss > 0 ? totalWeightLoss.toFixed(1) : '0.0'} lbs</div>
            <p className="text-xs text-muted-foreground mt-1">
              {weightLossPercentage > 0 ? `${weightLossPercentage.toFixed(1)}% of starting weight` : 'Start tracking to see progress'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              Completed Exercises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompletedExercises}</div>
            <p className="text-xs text-muted-foreground mt-1">Total exercises completed</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak}</div>
            <p className="text-xs text-muted-foreground mt-1">{currentStreak === 1 ? 'day' : 'days'} in a row</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-500" />
              Best Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maxStreak}</div>
            <p className="text-xs text-muted-foreground mt-1">Personal record</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-pink-500" />
            Exercise Completion Breakdown
          </CardTitle>
          <CardDescription>View your exercise completion patterns by category</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weekly">Weekly View</TabsTrigger>
              <TabsTrigger value="totals">Category Totals</TabsTrigger>
            </TabsList>

            <TabsContent value="weekly" className="space-y-4">
              {dailyData.length > 0 && dailyData.some((d) => d.resistance + d.cardio + d.core + d.stretching > 0) ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="resistance" stackId="a" fill="oklch(0.828 0.189 84.429)" name="Resistance" />
                      <Bar dataKey="cardio" stackId="a" fill="oklch(0.646 0.222 41.116)" name="Cardio" />
                      <Bar dataKey="core" stackId="a" fill="oklch(0.6 0.118 184.704)" name="Core" />
                      <Bar dataKey="stretching" stackId="a" fill="oklch(0.769 0.188 70.08)" name="Stretching" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No exercise data yet. Start planning and completing exercises to see your progress!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="totals" className="space-y-4">
              {totalCompletedExercises > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-2">Resistance</div>
                      <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                        {progressData ? Number(progressData.totalResistanceCompleted) : 0}
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">Cardio</div>
                      <div className="text-3xl font-bold text-red-700 dark:text-red-300">
                        {progressData ? Number(progressData.totalCardioCompleted) : 0}
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Core</div>
                      <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                        {progressData ? Number(progressData.totalCoreCompleted) : 0}
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">Stretching</div>
                      <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                        {progressData ? Number(progressData.totalStretchingCompleted) : 0}
                      </div>
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryTotalsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count">
                          {categoryTotalsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No exercise data yet. Start planning and completing exercises to see your progress!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {combinedCalorieChartData.length > 0 && (
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5 text-green-500" />
              Calorie Intake & Burned Trends
            </CardTitle>
            <CardDescription>Daily comparison of calorie intake vs. calories burned over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedCalorieChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="intake" 
                    stroke="oklch(0.6 0.118 184.704)" 
                    strokeWidth={2} 
                    dot={{ fill: 'oklch(0.6 0.118 184.704)', r: 4 }} 
                    name="Intake"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="burned" 
                    stroke="oklch(0.646 0.222 41.116)" 
                    strokeWidth={2} 
                    dot={{ fill: 'oklch(0.646 0.222 41.116)', r: 4 }} 
                    name="Burned"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {averageCalories > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-center text-blue-700 dark:text-blue-300">
                    <span className="font-semibold">Avg Daily Intake: {averageCalories.toFixed(0)} cal</span>
                  </div>
                </div>
              )}
              {averageBurnedCalories > 0 && (
                <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="text-center text-orange-700 dark:text-orange-300">
                    <span className="font-semibold">Avg Daily Burned: {averageBurnedCalories.toFixed(0)} cal</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {firstMeasurement && latestMeasurement && (
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-purple-500" />
              Measurement Changes
            </CardTitle>
            <CardDescription>Compare your first and latest measurements (inches)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['arms', 'legs', 'bust', 'hips'].map((part) => {
                const first = firstMeasurement[part as keyof typeof firstMeasurement] as number;
                const latest = latestMeasurement[part as keyof typeof latestMeasurement] as number;
                const change = first - latest;
                return (
                  <div key={part} className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="text-sm font-medium text-purple-900 dark:text-purple-100 capitalize mb-2">{part}</div>
                    <div className="text-2xl font-bold">{latest.toFixed(1)}"</div>
                    {change !== 0 && (
                      <div className={`text-sm mt-1 ${change > 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                        {change > 0 ? '-' : '+'}
                        {Math.abs(change).toFixed(1)}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
