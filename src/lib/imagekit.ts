import ImageKit from "imagekit";

export function getImageKitInstance() {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error("ImageKit configuration missing in environment variables.");
  }

  return new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });
}

/**
 * Uploads an image to ImageKit.
 * Accepts base64 string or buffer and uploads to the '/banners' folder.
 */
export async function uploadToImageKit(fileBase64OrBuffer: string | Buffer, fileName: string) {
  const imagekit = getImageKitInstance();
  const res = await imagekit.upload({
    file: fileBase64OrBuffer,
    fileName: fileName.replace(/\s+/g, "_"),
    folder: "/banners",
    useUniqueFileName: true,
  });

  return {
    fileId: res.fileId,
    url: res.url,
    thumbnailUrl: res.thumbnailUrl,
  };
}

/**
 * Deletes an image from ImageKit by fileId.
 */
export async function deleteFromImageKit(fileId: string) {
  if (!fileId) return;
  try {
    const imagekit = getImageKitInstance();
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error("Failed to delete file from ImageKit:", error);
  }
}

