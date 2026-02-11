import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, TrendingDown, Activity } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-xl opacity-50" />
              <div className="relative bg-white rounded-full p-6 shadow-lg">
                <Heart className="h-12 w-12 text-pink-500" fill="currentColor" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Weight Loss Tracker
          </h1>
          <p className="text-muted-foreground text-lg">
            Your personal journey to a healthier you
          </p>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to continue your wellness journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="flex flex-col items-center space-y-2">
                <div className="bg-pink-100 p-3 rounded-full">
                  <TrendingDown className="h-6 w-6 text-pink-600" />
                </div>
                <span className="text-xs text-center text-muted-foreground">Track Weight</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-xs text-center text-muted-foreground">Log Exercise</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-xs text-center text-muted-foreground">Stay Motivated</span>
              </div>
            </div>

            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full h-12 text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600"
            >
              {isLoggingIn ? 'Signing in...' : 'Sign In Securely'}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Your data is private and secure. Only you can access your progress.
            </p>
          </CardContent>
        </Card>

        <footer className="text-center text-sm text-muted-foreground">
          © 2025. Built with <Heart className="inline h-4 w-4 text-pink-500" fill="currentColor" /> using{' '}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
