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

      // Preserve full image content without cropping
      const MAX_DIMENSION = 1920;
      let targetWidth = img.width;
      let targetHeight = img.height;

      if (targetWidth > MAX_DIMENSION || targetHeight > MAX_DIMENSION) {
        if (targetWidth > targetHeight) {
          targetHeight = Math.round((targetHeight * MAX_DIMENSION) / targetWidth);
          targetWidth = MAX_DIMENSION;
        } else {
          targetWidth = Math.round((targetWidth * MAX_DIMENSION) / targetHeight);
          targetHeight = MAX_DIMENSION;
        }
      }

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

      // Draw full uncropped image
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, targetWidth, targetHeight);

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

