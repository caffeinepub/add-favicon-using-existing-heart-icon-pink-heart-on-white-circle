import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetCalorieEntries, useAddCalorieEntry, useUpdateCalorieEntry } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Apple, Plus, TrendingUp, Calendar, Edit2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { CalorieEntry } from '../backend';

interface CalorieTrackerProps {
  compact?: boolean;
}

export default function CalorieTracker({ compact = false }: CalorieTrackerProps) {
  const { data: calorieEntries = [] } = useGetCalorieEntries();
  const addCalorie = useAddCalorieEntry();
  const updateCalorie = useUpdateCalorieEntry();
  const [calories, setCalories] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState<{ index: number; entry: CalorieEntry } | null>(null);
  const [editCalories, setEditCalories] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const calorieValue = parseInt(calories);
    if (isNaN(calorieValue) || calorieValue <= 0) {
      toast.error('Please enter a valid calorie amount');
      return;
    }

    try {
      await addCalorie.mutateAsync({
        calories: BigInt(calorieValue),
        date: BigInt(Date.now() * 1000000),
      });
      toast.success('Calorie entry recorded successfully!');
      setCalories('');
      setIsAdding(false);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to record calorie entry';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleEdit = (index: number, entry: CalorieEntry) => {
    setEditingEntry({ index, entry });
    setEditCalories(entry.calories.toString());
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    const calorieValue = parseInt(editCalories);
    if (isNaN(calorieValue) || calorieValue <= 0) {
      toast.error('Please enter a valid calorie amount');
      return;
    }

    try {
      await updateCalorie.mutateAsync({
        index: editingEntry.index,
        entry: {
          calories: BigInt(calorieValue),
          date: editingEntry.entry.date,
        },
      });
      toast.success('Calorie entry updated successfully!');
      setEditingEntry(null);
      setEditCalories('');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to update calorie entry';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const chartData = calorieEntries.map((entry) => ({
    date: new Date(Number(entry.date / BigInt(1000000))).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    calories: Number(entry.calories),
  }));

  const latestEntry = calorieEntries[calorieEntries.length - 1];
  const averageCalories = calorieEntries.length > 0
    ? calorieEntries.reduce((sum, entry) => sum + Number(entry.calories), 0) / calorieEntries.length
    : 0;

  if (compact) {
    return (
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5 text-green-500" />
            Calorie Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          {latestEntry ? (
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{Number(latestEntry.calories)}</span>
                <span className="text-muted-foreground">cal</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">Avg: {averageCalories.toFixed(0)} cal</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {calorieEntries.length} total entries
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No calorie entries yet</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5 text-green-500" />
            Calorie Tracker
          </CardTitle>
          <CardDescription>Track your daily calorie intake</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isAdding ? (
            <Button onClick={() => setIsAdding(true)} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Calorie Entry
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="Enter calories consumed"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={addCalorie.isPending} className="flex-1">
                  {addCalorie.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {calorieEntries.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">All Entries</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {calorieEntries.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{Number(entry.calories)} calories</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(Number(entry.date / BigInt(1000000))).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(index, entry)}
                      className="gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {chartData.length > 0 && (
            <div className="space-y-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="calories" stroke="oklch(0.646 0.222 41.116)" strokeWidth={2} dot={{ fill: 'oklch(0.646 0.222 41.116)', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {averageCalories > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-700">
                      <TrendingUp className="h-5 w-5" />
                      <span className="font-semibold">Average Daily Intake: {averageCalories.toFixed(0)} calories</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-sm text-muted-foreground text-center">
                Tracking {calorieEntries.length} calorie {calorieEntries.length === 1 ? 'entry' : 'entries'}
              </div>
            </div>
          )}

          {chartData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Apple className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No calorie data yet. Add your first entry to start tracking!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Calorie Entry</DialogTitle>
            <DialogDescription>Update your calorie intake</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-calories">Calories</Label>
              <Input
                id="edit-calories"
                type="number"
                placeholder="Enter calories consumed"
                value={editCalories}
                onChange={(e) => setEditCalories(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={updateCalorie.isPending} className="flex-1">
                {updateCalorie.isPending ? 'Updating...' : 'Update'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditingEntry(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
