"use server";

import dbConnect from "@/lib/db";
import Banner from "@/models/Banner";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { uploadToImageKit, deleteFromImageKit } from "@/lib/imagekit";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Public action: Returns all currently active banners for the carousel.
 */
export async function getActiveBanners() {
  try {
    await dbConnect();
    const banners = await Banner.find({ active: true }).sort({ order: 1, createdAt: -1 }).lean();
    return {
      success: true,
      banners: JSON.parse(JSON.stringify(banners)),
    };
  } catch (error: any) {
    console.error("Failed to fetch active banners:", error);
    return { success: false, banners: [], error: error.message };
  }
}

/**
 * Admin action: Returns all banners (both active and inactive) for Settings management.
 */
export async function getAllBanners() {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await dbConnect();
    const banners = await Banner.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return {
      success: true,
      banners: JSON.parse(JSON.stringify(banners)),
    };
  } catch (error: any) {
    console.error("Failed to fetch banners for settings:", error);
    return { success: false, banners: [], error: error.message };
  }
}

/**
 * Admin action: Uploads an image to ImageKit and creates a new banner in MongoDB.
 * Enforces a strict 10MB maximum file size limit.
 */
export async function createBanner(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || "";
    const description = (formData.get("description") as string) || "";
    const order = Number(formData.get("order")) || 0;

    if (!file) {
      return { error: "No image file provided." };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { error: "File exceeds 10MB size limit. Please upload a smaller image." };
    }

    // Convert file to Buffer for ImageKit upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to ImageKit
    const uploaded = await uploadToImageKit(buffer, file.name || "banner.jpg");

    // Persist to MongoDB
    await dbConnect();
    const banner = await Banner.create({
      title: title.trim(),
      description: description.trim(),
      imageUrl: uploaded.url,
      fileId: uploaded.fileId,
      order,
      active: true,
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/settings");

    return {
      success: true,
      banner: JSON.parse(JSON.stringify(banner)),
    };
  } catch (error: any) {
    console.error("Failed to create banner:", error);
    return { error: error.message || "Failed to upload banner" };
  }
}

/**
 * Admin action: Deletes a banner from MongoDB and purges it from ImageKit.
 */
export async function deleteBanner(bannerId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await dbConnect();
    const banner = await Banner.findById(bannerId);
    if (!banner) {
      return { error: "Banner not found" };
    }

    // Delete image from ImageKit
    if (banner.fileId) {
      await deleteFromImageKit(banner.fileId);
    }

    // Delete document from DB
    await Banner.findByIdAndDelete(bannerId);

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/settings");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete banner:", error);
    return { error: error.message || "Failed to delete banner" };
  }
}

/**
 * Admin action: Toggles active status of a banner.
 */
export async function toggleBannerActive(bannerId: string, active: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await dbConnect();
    await Banner.findByIdAndUpdate(bannerId, { active });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/settings");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to toggle banner status:", error);
    return { error: error.message || "Failed to toggle banner" };
  }
}

