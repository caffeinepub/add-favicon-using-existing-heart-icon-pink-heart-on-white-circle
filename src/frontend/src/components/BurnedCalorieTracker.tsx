import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetBurnedCalorieEntries, useAddBurnedCalorieEntry, useUpdateBurnedCalorieEntry } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Flame, Plus, TrendingUp, Calendar, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { BurnedCalorieEntry } from '../backend';

interface BurnedCalorieTrackerProps {
  compact?: boolean;
}

export default function BurnedCalorieTracker({ compact = false }: BurnedCalorieTrackerProps) {
  const { data: burnedCalorieEntries = [] } = useGetBurnedCalorieEntries();
  const addBurnedCalorie = useAddBurnedCalorieEntry();
  const updateBurnedCalorie = useUpdateBurnedCalorieEntry();
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState<{ index: number; entry: BurnedCalorieEntry } | null>(null);
  const [editCaloriesBurned, setEditCaloriesBurned] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const calorieValue = parseInt(caloriesBurned);
    if (isNaN(calorieValue) || calorieValue <= 0) {
      toast.error('Please enter a valid calorie amount');
      return;
    }

    try {
      await addBurnedCalorie.mutateAsync({
        caloriesBurned: BigInt(calorieValue),
        date: BigInt(Date.now() * 1000000),
      });
      toast.success('Burned calorie entry recorded successfully!');
      setCaloriesBurned('');
      setIsAdding(false);
    } catch (error) {
      toast.error('Failed to record burned calorie entry');
      console.error(error);
    }
  };

  const handleEdit = (index: number, entry: BurnedCalorieEntry) => {
    setEditingEntry({ index, entry });
    setEditCaloriesBurned(entry.caloriesBurned.toString());
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    const calorieValue = parseInt(editCaloriesBurned);
    if (isNaN(calorieValue) || calorieValue <= 0) {
      toast.error('Please enter a valid calorie amount');
      return;
    }

    try {
      await updateBurnedCalorie.mutateAsync({
        index: editingEntry.index,
        entry: {
          caloriesBurned: BigInt(calorieValue),
          date: editingEntry.entry.date,
        },
      });
      toast.success('Burned calorie entry updated successfully!');
      setEditingEntry(null);
      setEditCaloriesBurned('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update burned calorie entry');
      console.error(error);
    }
  };

  const latestEntry = burnedCalorieEntries[burnedCalorieEntries.length - 1];
  const averageBurnedCalories = burnedCalorieEntries.length > 0
    ? burnedCalorieEntries.reduce((sum, entry) => sum + Number(entry.caloriesBurned), 0) / burnedCalorieEntries.length
    : 0;

  if (compact) {
    return (
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Burned Calories
          </CardTitle>
        </CardHeader>
        <CardContent>
          {latestEntry ? (
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{Number(latestEntry.caloriesBurned)}</span>
                <span className="text-muted-foreground">cal</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-orange-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">Avg: {averageBurnedCalories.toFixed(0)} cal</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {burnedCalorieEntries.length} total entries
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No burned calorie entries yet</p>
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
            <Flame className="h-5 w-5 text-orange-500" />
            Burned Calorie Tracker
          </CardTitle>
          <CardDescription>Track your daily burned calories from exercise and activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isAdding ? (
            <Button onClick={() => setIsAdding(true)} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Burned Calorie Entry
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="caloriesBurned">Calories Burned</Label>
                <Input
                  id="caloriesBurned"
                  type="number"
                  placeholder="Enter calories burned"
                  value={caloriesBurned}
                  onChange={(e) => setCaloriesBurned(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={addBurnedCalorie.isPending} className="flex-1">
                  {addBurnedCalorie.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {burnedCalorieEntries.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">All Entries</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {burnedCalorieEntries.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{Number(entry.caloriesBurned)} calories burned</div>
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

          {burnedCalorieEntries.length > 0 ? (
            <div className="space-y-4">
              {averageBurnedCalories > 0 && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-orange-700">
                      <TrendingUp className="h-5 w-5" />
                      <span className="font-semibold">Average Daily Burn: {averageBurnedCalories.toFixed(0)} calories</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-sm text-muted-foreground text-center">
                Tracking {burnedCalorieEntries.length} burned calorie {burnedCalorieEntries.length === 1 ? 'entry' : 'entries'}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Flame className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No burned calorie data yet. Add your first entry to start tracking!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Burned Calorie Entry</DialogTitle>
            <DialogDescription>Update your burned calories (Feature coming soon)</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-caloriesBurned">Calories Burned</Label>
              <Input
                id="edit-caloriesBurned"
                type="number"
                placeholder="Enter calories burned"
                value={editCaloriesBurned}
                onChange={(e) => setEditCaloriesBurned(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              Note: Edit functionality for burned calories is coming soon. For now, please delete and re-add the entry if you need to make changes.
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={updateBurnedCalorie.isPending} className="flex-1">
                {updateBurnedCalorie.isPending ? 'Updating...' : 'Update (Coming Soon)'}
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

