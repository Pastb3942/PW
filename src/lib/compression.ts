export interface CompressionResult {
  dataUrl: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  reductionPercentage: number;
  width: number;
  height: number;
  mimeType: string;
}

/**
 * Compresses an image file on the client side using HTML5 Canvas.
 * Solves upload timeouts and massive payload issues on mobile 4G/5G cameras.
 */
export async function compressClientImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const originalSizeBytes = file.size;
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect ratio preserving downscale
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('Canvas 2D context unavailable'));
        }

        // Use high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Attempt WebP, fallback to JPEG
        let compressedDataUrl = canvas.toDataURL('image/webp', quality);
        let mimeType = 'image/webp';

        // Check if WebP supported
        if (!compressedDataUrl.startsWith('data:image/webp')) {
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          mimeType = 'image/jpeg';
        }

        // Calculate approximate size of base64
        const head = compressedDataUrl.indexOf(',') + 1;
        const compressedSizeBytes = Math.round((compressedDataUrl.length - head) * 0.75);

        const reductionPercentage = Math.max(
          0,
          Math.round(((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100)
        );

        resolve({
          dataUrl: compressedDataUrl,
          originalSizeBytes,
          compressedSizeBytes,
          reductionPercentage,
          width,
          height,
          mimeType
        });
      };

      img.onerror = () => reject(new Error('Failed to load image file'));
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes to human readable string (KB, MB)
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
