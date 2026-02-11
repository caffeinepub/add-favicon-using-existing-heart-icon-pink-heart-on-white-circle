import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ProgressPhotoGallery() {
  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-purple-500" />
          Progress Photo Gallery
        </CardTitle>
        <CardDescription>Upload and track your monthly progress photos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Feature Coming Soon</AlertTitle>
          <AlertDescription>
            The progress photo gallery feature is currently being set up. 
            Photo upload and storage functionality will be available in the next update.
          </AlertDescription>
        </Alert>

        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Photo gallery will be available soon!</p>
          <p className="text-sm mt-2">You'll be able to upload and track your progress photos here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
