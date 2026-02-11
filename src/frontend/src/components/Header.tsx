import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, LogOut, Settings } from 'lucide-react';
import ProfileEditDialog from './ProfileEditDialog';

interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

export default function Header({ userName, onLogout }: HeaderProps) {
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  return (
    <>
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-full p-2">
              <Heart className="h-6 w-6 text-white" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Weight Loss Tracker
              </h1>
              <p className="text-sm text-muted-foreground">Welcome back, {userName}!</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="default"
              onClick={() => setIsProfileDialogOpen(true)}
              className="gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Edit Profile</span>
            </Button>
            <Button variant="outline" onClick={onLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <ProfileEditDialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen} />
    </>
  );
}

