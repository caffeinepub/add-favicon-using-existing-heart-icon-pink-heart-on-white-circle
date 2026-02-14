/**
 * Utility to generate favicon PNG files programmatically
 * This creates favicon files with a pink heart on a solid white circular background
 */

export function generateHeartFavicon(size: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Clear canvas with transparent background
  ctx.clearRect(0, 0, size, size);
  
  // Draw solid white circle background
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2;
  
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  
  // Pink heart color matching the app theme
  ctx.fillStyle = '#ec4899';
  
  // Draw heart shape (scaled to fit nicely on the white circle)
  const heartScale = 0.6; // Scale down the heart to fit better on the circle
  
  ctx.beginPath();
  
  // Start at bottom point
  ctx.moveTo(centerX, centerY + size * 0.25 * heartScale);
  
  // Left side curves
  ctx.bezierCurveTo(
    centerX, centerY - size * 0.1 * heartScale,
    centerX - size * 0.35 * heartScale, centerY - size * 0.35 * heartScale,
    centerX - size * 0.25 * heartScale, centerY - size * 0.15 * heartScale
  );
  
  ctx.bezierCurveTo(
    centerX - size * 0.35 * heartScale, centerY - size * 0.35 * heartScale,
    centerX - size * 0.45 * heartScale, centerY - size * 0.1 * heartScale,
    centerX - size * 0.25 * heartScale, centerY + size * 0.05 * heartScale
  );
  
  ctx.lineTo(centerX, centerY + size * 0.25 * heartScale);
  
  // Right side curves
  ctx.bezierCurveTo(
    centerX + size * 0.25 * heartScale, centerY + size * 0.05 * heartScale,
    centerX + size * 0.45 * heartScale, centerY - size * 0.1 * heartScale,
    centerX + size * 0.25 * heartScale, centerY - size * 0.15 * heartScale
  );
  
  ctx.bezierCurveTo(
    centerX + size * 0.35 * heartScale, centerY - size * 0.35 * heartScale,
    centerX, centerY - size * 0.1 * heartScale,
    centerX, centerY + size * 0.25 * heartScale
  );
  
  ctx.closePath();
  ctx.fill();
  
  // Return data URL
  return canvas.toDataURL('image/png');
}

export async function downloadFavicon(size: number, filename: string): Promise<void> {
  const dataUrl = generateHeartFavicon(size);
  
  // Convert data URL to blob
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const FAVICON_SIZES = [
  { size: 16, name: 'favicon-16.dim_16x16.png' },
  { size: 32, name: 'favicon-32.dim_32x32.png' },
  { size: 180, name: 'apple-touch-icon.dim_180x180.png' },
  { size: 192, name: 'android-chrome-192.dim_192x192.png' },
  { size: 512, name: 'android-chrome-512.dim_512x512.png' },
] as const;
