import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetBodyMeasurements, useAddBodyMeasurement, useUpdateBodyMeasurement } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Ruler, Plus, TrendingDown, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { BodyMeasurements } from '../backend';

export default function MeasurementsTracker() {
  const { data: measurements = [] } = useGetBodyMeasurements();
  const addMeasurement = useAddBodyMeasurement();
  const updateMeasurement = useUpdateBodyMeasurement();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    arms: '',
    legs: '',
    bust: '',
    hips: '',
  });
  const [editingMeasurement, setEditingMeasurement] = useState<{ index: number; measurement: BodyMeasurements } | null>(null);
  const [editFormData, setEditFormData] = useState({
    arms: '',
    legs: '',
    bust: '',
    hips: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const arms = parseFloat(formData.arms);
    const legs = parseFloat(formData.legs);
    const bust = parseFloat(formData.bust);
    const hips = parseFloat(formData.hips);

    if (isNaN(arms) || isNaN(legs) || isNaN(bust) || isNaN(hips)) {
      toast.error('Please enter valid measurements');
      return;
    }

    if (arms <= 0 || legs <= 0 || bust <= 0 || hips <= 0) {
      toast.error('Measurements must be greater than zero');
      return;
    }

    try {
      await addMeasurement.mutateAsync({
        arms,
        legs,
        bust,
        hips,
        date: BigInt(Date.now() * 1000000),
      });
      toast.success('Measurements recorded successfully!');
      setFormData({ arms: '', legs: '', bust: '', hips: '' });
      setIsAdding(false);
    } catch (error) {
      toast.error('Failed to record measurements');
      console.error(error);
    }
  };

  const handleEdit = (index: number, measurement: BodyMeasurements) => {
    setEditingMeasurement({ index, measurement });
    setEditFormData({
      arms: measurement.arms.toString(),
      legs: measurement.legs.toString(),
      bust: measurement.bust.toString(),
      hips: measurement.hips.toString(),
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMeasurement) return;

    const arms = parseFloat(editFormData.arms);
    const legs = parseFloat(editFormData.legs);
    const bust = parseFloat(editFormData.bust);
    const hips = parseFloat(editFormData.hips);

    if (isNaN(arms) || isNaN(legs) || isNaN(bust) || isNaN(hips)) {
      toast.error('Please enter valid measurements');
      return;
    }

    if (arms <= 0 || legs <= 0 || bust <= 0 || hips <= 0) {
      toast.error('Measurements must be greater than zero');
      return;
    }

    try {
      await updateMeasurement.mutateAsync({
        index: editingMeasurement.index,
        measurement: {
          arms,
          legs,
          bust,
          hips,
          date: editingMeasurement.measurement.date,
        },
      });
      toast.success('Measurements updated successfully!');
      setEditingMeasurement(null);
      setEditFormData({ arms: '', legs: '', bust: '', hips: '' });
    } catch (error) {
      toast.error('Failed to update measurements');
      console.error(error);
    }
  };

  const latestMeasurement = measurements[measurements.length - 1];
  const firstMeasurement = measurements[0];

  return (
    <>
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-purple-500" />
            Body Measurements
          </CardTitle>
          <CardDescription>Track your monthly body measurements in inches</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isAdding ? (
            <Button onClick={() => setIsAdding(true)} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Measurements
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="arms">Arms (in)</Label>
                  <Input
                    id="arms"
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.arms}
                    onChange={(e) => setFormData({ ...formData, arms: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legs">Legs (in)</Label>
                  <Input
                    id="legs"
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.legs}
                    onChange={(e) => setFormData({ ...formData, legs: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bust">Bust (in)</Label>
                  <Input
                    id="bust"
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.bust}
                    onChange={(e) => setFormData({ ...formData, bust: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hips">Hips (in)</Label>
                  <Input
                    id="hips"
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.hips}
                    onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={addMeasurement.isPending} className="flex-1">
                  {addMeasurement.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {measurements.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">All Entries</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {measurements.map((measurement, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-1 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Arms:</span>
                        <span className="ml-2 font-medium">{measurement.arms.toFixed(1)}"</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Legs:</span>
                        <span className="ml-2 font-medium">{measurement.legs.toFixed(1)}"</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Bust:</span>
                        <span className="ml-2 font-medium">{measurement.bust.toFixed(1)}"</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Hips:</span>
                        <span className="ml-2 font-medium">{measurement.hips.toFixed(1)}"</span>
                      </div>
                      <div className="col-span-2 text-xs text-muted-foreground">
                        {new Date(Number(measurement.date / BigInt(1000000))).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(index, measurement)}
                      className="gap-2 ml-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {latestMeasurement && (
            <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-sm text-purple-900">Latest Measurements</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Arms:</span>
                  <span className="ml-2 font-medium">{latestMeasurement.arms.toFixed(1)}"</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Legs:</span>
                  <span className="ml-2 font-medium">{latestMeasurement.legs.toFixed(1)}"</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Bust:</span>
                  <span className="ml-2 font-medium">{latestMeasurement.bust.toFixed(1)}"</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Hips:</span>
                  <span className="ml-2 font-medium">{latestMeasurement.hips.toFixed(1)}"</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {measurements.length} total {measurements.length === 1 ? 'entry' : 'entries'}
              </div>
            </div>
          )}

          {firstMeasurement && latestMeasurement && measurements.length > 1 && (
            <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-sm text-green-900 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Total Changes
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {['arms', 'legs', 'bust', 'hips'].map((part) => {
                  const first = firstMeasurement[part as keyof typeof firstMeasurement] as number;
                  const latest = latestMeasurement[part as keyof typeof latestMeasurement] as number;
                  const change = first - latest;
                  if (change === 0) return null;
                  return (
                    <div key={part}>
                      <span className="text-muted-foreground capitalize">{part}:</span>
                      <span className={`ml-2 font-medium ${change > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                        {change > 0 ? '-' : '+'}{Math.abs(change).toFixed(1)}"
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {measurements.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Ruler className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No measurements yet. Add your first entry to start tracking!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingMeasurement} onOpenChange={(open) => !open && setEditingMeasurement(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Body Measurements</DialogTitle>
            <DialogDescription>Update your body measurements</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-arms">Arms (in)</Label>
                <Input
                  id="edit-arms"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={editFormData.arms}
                  onChange={(e) => setEditFormData({ ...editFormData, arms: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-legs">Legs (in)</Label>
                <Input
                  id="edit-legs"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={editFormData.legs}
                  onChange={(e) => setEditFormData({ ...editFormData, legs: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-bust">Bust (in)</Label>
                <Input
                  id="edit-bust"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={editFormData.bust}
                  onChange={(e) => setEditFormData({ ...editFormData, bust: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-hips">Hips (in)</Label>
                <Input
                  id="edit-hips"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={editFormData.hips}
                  onChange={(e) => setEditFormData({ ...editFormData, hips: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={updateMeasurement.isPending} className="flex-1">
                {updateMeasurement.isPending ? 'Updating...' : 'Update'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditingMeasurement(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
