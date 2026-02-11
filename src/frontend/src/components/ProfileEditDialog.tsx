import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { User } from 'lucide-react';
import { MotivationalStyle } from '../backend';
import type { UserProfile } from '../backend';

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileEditDialog({ open, onOpenChange }: ProfileEditDialogProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [motivationalStyle, setMotivationalStyle] = useState<MotivationalStyle>(MotivationalStyle.balanced);
  const [shareProgress, setShareProgress] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setEmail(userProfile.email);
      setMotivationalStyle(userProfile.preferences.motivationalStyle);
      setShareProgress(userProfile.preferences.shareProgress);
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    const profile: UserProfile = {
      name: name.trim(),
      email: email.trim(),
      preferences: {
        motivationalStyle,
        shareProgress,
      },
    };

    try {
      await saveProfile.mutateAsync(profile);
      toast.success('Profile updated successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-full p-3">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Edit Profile</DialogTitle>
          <DialogDescription className="text-center">
            Update your personal information and preferences
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Your Name</Label>
            <Input
              id="edit-name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">Email Address</Label>
            <Input
              id="edit-email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Motivational Style</Label>
            <RadioGroup value={motivationalStyle} onValueChange={(value) => setMotivationalStyle(value as MotivationalStyle)}>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                <RadioGroupItem value={MotivationalStyle.gentle} id="edit-gentle" />
                <Label htmlFor="edit-gentle" className="flex-1 cursor-pointer">
                  <div className="font-medium">Gentle</div>
                  <div className="text-sm text-muted-foreground">Encouraging and supportive messages</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                <RadioGroupItem value={MotivationalStyle.balanced} id="edit-balanced" />
                <Label htmlFor="edit-balanced" className="flex-1 cursor-pointer">
                  <div className="font-medium">Balanced</div>
                  <div className="text-sm text-muted-foreground">Mix of encouragement and accountability</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                <RadioGroupItem value={MotivationalStyle.direct} id="edit-direct" />
                <Label htmlFor="edit-direct" className="flex-1 cursor-pointer">
                  <div className="font-medium">Direct</div>
                  <div className="text-sm text-muted-foreground">Straightforward and goal-focused</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="space-y-0.5">
              <Label htmlFor="edit-share">Share Progress</Label>
              <div className="text-sm text-muted-foreground">
                Allow sharing general progress percentages
              </div>
            </div>
            <Switch id="edit-share" checked={shareProgress} onCheckedChange={setShareProgress} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={saveProfile.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600"
              disabled={saveProfile.isPending}
            >
              {saveProfile.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

