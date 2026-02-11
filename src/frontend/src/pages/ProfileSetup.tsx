import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Heart, Sparkles } from 'lucide-react';
import { MotivationalStyle } from '../backend';
import type { UserProfile } from '../backend';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [motivationalStyle, setMotivationalStyle] = useState<MotivationalStyle>(MotivationalStyle.balanced);
  const [shareProgress, setShareProgress] = useState(false);

  const saveProfile = useSaveCallerUserProfile();

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
      toast.success('Profile created successfully!');
    } catch (error) {
      toast.error('Failed to create profile. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-2 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-full p-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl">Welcome!</CardTitle>
          <CardDescription>Let's set up your profile to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
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
                  <RadioGroupItem value={MotivationalStyle.gentle} id="gentle" />
                  <Label htmlFor="gentle" className="flex-1 cursor-pointer">
                    <div className="font-medium">Gentle</div>
                    <div className="text-sm text-muted-foreground">Encouraging and supportive messages</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                  <RadioGroupItem value={MotivationalStyle.balanced} id="balanced" />
                  <Label htmlFor="balanced" className="flex-1 cursor-pointer">
                    <div className="font-medium">Balanced</div>
                    <div className="text-sm text-muted-foreground">Mix of encouragement and accountability</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                  <RadioGroupItem value={MotivationalStyle.direct} id="direct" />
                  <Label htmlFor="direct" className="flex-1 cursor-pointer">
                    <div className="font-medium">Direct</div>
                    <div className="text-sm text-muted-foreground">Straightforward and goal-focused</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <Label htmlFor="share">Share Progress</Label>
                <div className="text-sm text-muted-foreground">
                  Allow sharing general progress percentages
                </div>
              </div>
              <Switch id="share" checked={shareProgress} onCheckedChange={setShareProgress} />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600"
              disabled={saveProfile.isPending}
            >
              {saveProfile.isPending ? 'Creating Profile...' : 'Get Started'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
