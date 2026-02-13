/**
 * Utility to generate favicon PNG files programmatically
 * This creates the missing favicon files that index.html references
 */

export function generateHeartFavicon(size: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Clear canvas with transparent background
  ctx.clearRect(0, 0, size, size);
  
  // Pink heart color matching the app theme
  ctx.fillStyle = '#ec4899';
  
  // Draw heart shape
  const centerX = size / 2;
  const centerY = size / 2;
  
  ctx.beginPath();
  
  // Start at bottom point
  ctx.moveTo(centerX, centerY + size * 0.25);
  
  // Left side curves
  ctx.bezierCurveTo(
    centerX, centerY - size * 0.1,
    centerX - size * 0.35, centerY - size * 0.35,
    centerX - size * 0.25, centerY - size * 0.15
  );
  
  ctx.bezierCurveTo(
    centerX - size * 0.35, centerY - size * 0.35,
    centerX - size * 0.45, centerY - size * 0.1,
    centerX - size * 0.25, centerY + size * 0.05
  );
  
  ctx.lineTo(centerX, centerY + size * 0.25);
  
  // Right side curves
  ctx.bezierCurveTo(
    centerX + size * 0.25, centerY + size * 0.05,
    centerX + size * 0.45, centerY - size * 0.1,
    centerX + size * 0.25, centerY - size * 0.15
  );
  
  ctx.bezierCurveTo(
    centerX + size * 0.35, centerY - size * 0.35,
    centerX, centerY - size * 0.1,
    centerX, centerY + size * 0.25
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
