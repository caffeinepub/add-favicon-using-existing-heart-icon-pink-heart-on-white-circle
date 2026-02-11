import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetDailyMotivationalSaying } from '../hooks/useQueries';
import { Sparkles } from 'lucide-react';

export default function MotivationCard() {
  const { data: saying, isLoading } = useGetDailyMotivationalSaying();

  if (isLoading) {
    return (
      <Card className="border-2 shadow-lg bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-pink-950/30 dark:via-purple-950/30 dark:to-blue-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Daily Motivation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-20 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading your daily motivation...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 shadow-lg bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-pink-950/30 dark:via-purple-950/30 dark:to-blue-950/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Daily Motivation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="border-l-4 border-purple-400 pl-4 italic">
          <p className="text-lg leading-relaxed font-medium text-foreground mb-2">
            "{saying?.message}"
          </p>
          <footer className="text-sm text-muted-foreground">— {saying?.author}</footer>
        </blockquote>
      </CardContent>
    </Card>
  );
}
