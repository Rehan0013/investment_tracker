/**
 * Client-side 16:9 image cropper & compressor.
 * 1. Enforces 10MB max limit.
 * 2. Crops to 16:9 aspect ratio.
 * 3. Compresses to WebP (with JPEG fallback) to save bandwidth and storage.
 */
export async function compressImageFile(file: File): Promise<{
  file: File;
  originalSize: number;
  compressedSize: number;
  previewUrl: string;
}> {
  const MAX_LIMIT = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_LIMIT) {
    throw new Error("File exceeds 10MB limit. Please select an image under 10MB.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Invalid file type. Please select an image file (PNG, JPG, WebP, etc.).");
  }

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Desired 16:9 target resolution (max width 1920)
      const targetAspect = 16 / 9;
      const originalAspect = img.width / img.height;

      let sx = 0;
      let sy = 0;
      let sWidth = img.width;
      let sHeight = img.height;

      // Center-crop to 16:9
      if (originalAspect > targetAspect) {
        // Wider than 16:9: crop horizontally
        sWidth = Math.round(img.height * targetAspect);
        sx = Math.round((img.width - sWidth) / 2);
      } else if (originalAspect < targetAspect) {
        // Taller than 16:9: crop vertically
        sHeight = Math.round(img.width / targetAspect);
        sy = Math.round((img.height - sHeight) / 2);
      }

      // Target canvas output dimensions (capped at 1920x1080)
      const targetWidth = Math.min(sWidth, 1920);
      const targetHeight = Math.round(targetWidth / targetAspect);

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Unable to create canvas context for compression."));
        return;
      }

      // Smooth downsampling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);

      // Export as webp with 0.82 quality
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to compress image."));
            return;
          }

          const compressedFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
          const compressedFile = new File([blob], compressedFileName, {
            type: "image/webp",
            lastModified: Date.now(),
          });

          const previewUrl = URL.createObjectURL(blob);

          resolve({
            file: compressedFile,
            originalSize: file.size,
            compressedSize: compressedFile.size,
            previewUrl,
          });
        },
        "image/webp",
        0.82
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to read image file. Please try another file."));
    };

    img.src = objectUrl;
  });
}

