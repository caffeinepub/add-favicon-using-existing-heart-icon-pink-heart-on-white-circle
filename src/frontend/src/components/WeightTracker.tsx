import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetWeightRecords, useAddWeightRecord, useUpdateWeightRecord } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Scale, Plus, TrendingDown, Calendar, Edit2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { WeightRecord } from '../backend';

interface WeightTrackerProps {
  compact?: boolean;
}

export default function WeightTracker({ compact = false }: WeightTrackerProps) {
  const { data: weightRecords = [] } = useGetWeightRecords();
  const addWeight = useAddWeightRecord();
  const updateWeight = useUpdateWeightRecord();
  const [weight, setWeight] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingRecord, setEditingRecord] = useState<{ index: number; record: WeightRecord } | null>(null);
  const [editWeight, setEditWeight] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      toast.error('Please enter a valid weight');
      return;
    }

    try {
      await addWeight.mutateAsync({
        weight: weightValue,
        date: BigInt(Date.now() * 1000000),
      });
      toast.success('Weight recorded successfully!');
      setWeight('');
      setIsAdding(false);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to record weight';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleEdit = (index: number, record: WeightRecord) => {
    setEditingRecord({ index, record });
    setEditWeight(record.weight.toString());
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    const weightValue = parseFloat(editWeight);
    if (isNaN(weightValue) || weightValue <= 0) {
      toast.error('Please enter a valid weight');
      return;
    }

    try {
      await updateWeight.mutateAsync({
        index: editingRecord.index,
        record: {
          weight: weightValue,
          date: editingRecord.record.date,
        },
      });
      toast.success('Weight updated successfully!');
      setEditingRecord(null);
      setEditWeight('');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to update weight';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const chartData = weightRecords.map((record) => ({
    date: new Date(Number(record.date / BigInt(1000000))).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: record.weight,
  }));

  const latestWeight = weightRecords[weightRecords.length - 1];
  const firstWeight = weightRecords[0];
  const weightLoss = firstWeight && latestWeight ? firstWeight.weight - latestWeight.weight : 0;
  const weightLossPercentage = firstWeight && weightLoss > 0 ? (weightLoss / firstWeight.weight) * 100 : 0;

  if (compact) {
    return (
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-500" />
            Weight Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          {latestWeight ? (
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{latestWeight.weight.toFixed(1)}</span>
                <span className="text-muted-foreground">lbs</span>
              </div>
              {weightLoss > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600">
                    <TrendingDown className="h-4 w-4" />
                    <span className="font-medium">{weightLoss.toFixed(1)} lbs lost</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {weightLossPercentage.toFixed(1)}% of starting weight
                  </div>
                </div>
              )}
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {weightRecords.length} total entries
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No weight records yet</p>
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
            <Scale className="h-5 w-5 text-blue-500" />
            Weight Tracker
          </CardTitle>
          <CardDescription>Record your weekly weight measurements in pounds (lbs)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isAdding ? (
            <Button onClick={() => setIsAdding(true)} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Weight Entry
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="Enter your weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={addWeight.isPending} className="flex-1">
                  {addWeight.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {weightRecords.length > 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">All Entries</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {weightRecords.map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{record.weight.toFixed(1)} lbs</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(Number(record.date / BigInt(1000000))).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(index, record)}
                        className="gap-2"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
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
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="oklch(0.6 0.118 184.704)" strokeWidth={2} dot={{ fill: 'oklch(0.6 0.118 184.704)', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {weightLoss > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-700">
                      <TrendingDown className="h-5 w-5" />
                      <span className="font-semibold">Total Weight Loss: {weightLoss.toFixed(1)} lbs</span>
                    </div>
                    <div className="text-sm text-green-600">
                      {weightLossPercentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              )}

              <div className="text-sm text-muted-foreground text-center">
                Tracking {weightRecords.length} weight {weightRecords.length === 1 ? 'entry' : 'entries'}
              </div>
            </div>
          )}

          {chartData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Scale className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No weight data yet. Add your first entry to start tracking!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingRecord} onOpenChange={(open) => !open && setEditingRecord(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Weight Entry</DialogTitle>
            <DialogDescription>Update your weight measurement</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-weight">Weight (lbs)</Label>
              <Input
                id="edit-weight"
                type="number"
                step="0.1"
                placeholder="Enter your weight"
                value={editWeight}
                onChange={(e) => setEditWeight(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={updateWeight.isPending} className="flex-1">
                {updateWeight.isPending ? 'Updating...' : 'Update'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditingRecord(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
