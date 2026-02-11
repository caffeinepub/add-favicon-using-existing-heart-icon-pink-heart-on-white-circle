import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart } from 'lucide-react';
import Header from '../components/Header';
import MotivationCard from '../components/MotivationCard';
import WeightTracker from '../components/WeightTracker';
import CalorieTracker from '../components/CalorieTracker';
import BurnedCalorieTracker from '../components/BurnedCalorieTracker';
import MeasurementsTracker from '../components/MeasurementsTracker';
import ExerciseTracker from '../components/ExerciseTracker';
import ExercisePlanner from '../components/ExercisePlanner';
import ProgressView from '../components/ProgressView';
import ProgressPhotoGallery from '../components/ProgressPhotoGallery';

export default function Dashboard() {
  const { clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Header userName={userProfile?.name || 'User'} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="track">Track</TabsTrigger>
            <TabsTrigger value="exercise">Exercise</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Your Dashboard</h2>
              <p className="text-muted-foreground">Track your progress and stay motivated</p>
            </div>

            <MotivationCard />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <WeightTracker compact />
              <CalorieTracker compact />
              <BurnedCalorieTracker compact />
              <ExerciseTracker compact />
            </div>
          </TabsContent>

          <TabsContent value="track" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <WeightTracker />
              <div className="space-y-6">
                <CalorieTracker />
                <BurnedCalorieTracker />
              </div>
            </div>
            <MeasurementsTracker />
          </TabsContent>

          <TabsContent value="exercise" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ExercisePlanner />
              <ExerciseTracker />
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <ProgressPhotoGallery />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <ProgressView />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t bg-white/50 backdrop-blur-sm py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025. Built with <Heart className="inline h-4 w-4 text-pink-500" fill="currentColor" /> using{' '}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
