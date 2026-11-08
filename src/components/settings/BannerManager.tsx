"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Sparkles,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Zap,
  Layers,
  ArrowRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { compressImageFile } from "@/lib/compressImage";
import { createBanner, deleteBanner, toggleBannerActive } from "@/actions/banner.actions";
import { toast } from "sonner";
import { IBanner } from "@/models/Banner";

interface BannerManagerProps {
  initialBanners: any[];
}

export function BannerManager({ initialBanners }: BannerManagerProps) {
  const [banners, setBanners] = useState<any[]>(initialBanners);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: number;
    compressedSize: number;
  } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // File selection & instant 16:9 compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File exceeds 10MB limit. Please select an image under 10MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      setIsCompressing(true);
      setSelectedFile(file);

      const result = await compressImageFile(file);
      setCompressedFile(result.file);
      setPreviewUrl(result.previewUrl);
      setCompressionStats({
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
      });

      const savedPercent = Math.round(
        ((result.originalSize - result.compressedSize) / result.originalSize) * 100
      );
      toast.success(
        `Image auto-cropped to 16:9 and compressed (${savedPercent}% space saved)!`
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to process image.");
      setSelectedFile(null);
      setCompressedFile(null);
      setPreviewUrl(null);
      setCompressionStats(null);
    } finally {
      setIsCompressing(false);
    }
  };

  // Submit banner upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compressedFile) {
      toast.error("Please choose an image banner first.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", compressedFile);
    formData.append("title", title);
    formData.append("description", description);

    startTransition(async () => {
      try {
        const res = await createBanner(formData);
        if (res?.error) {
          toast.error(res.error);
        } else if (res?.success && res.banner) {
          toast.success("Banner published to carousel successfully!");
          setBanners((prev) => [res.banner, ...prev]);
          // Reset form
          setTitle("");
          setDescription("");
          setSelectedFile(null);
          setCompressedFile(null);
          setPreviewUrl(null);
          setCompressionStats(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      } catch (err: any) {
        toast.error(err.message || "Upload failed.");
      } finally {
        setIsUploading(false);
      }
    });
  };

  // Delete banner
  const handleDelete = async (bannerId: string) => {
    if (!confirm("Are you sure you want to remove this banner? It will be deleted from ImageKit and the carousel.")) {
      return;
    }

    startTransition(async () => {
      const res = await deleteBanner(bannerId);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Banner removed.");
        setBanners((prev) => prev.filter((b) => b._id !== bannerId));
      }
    });
  };

  // Toggle active status
  const handleToggleActive = async (bannerId: string, currentActive: boolean) => {
    startTransition(async () => {
      const res = await toggleBannerActive(bannerId, !currentActive);
      if (res?.error) {
        toast.error(res.error);
      } else {
        setBanners((prev) =>
          prev.map((b) => (b._id === bannerId ? { ...b, active: !currentActive } : b))
        );
        toast.success(`Banner ${!currentActive ? "activated" : "hidden"} in carousel.`);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload New Banner Card */}
      <Card className="p-5 sm:p-6 space-y-5 border-border">
        <div className="flex items-center justify-between pb-3 border-b border-border/70">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff5722]" />
              <span>Festival & Bonus Banners (ImageKit Carousel)</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload 16:9 banners wishing festivals or announcing bonuses. Visible on landing page and dashboard.
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#ff5722] bg-[#ff5722]/10 border border-[#ff5722]/20 px-2.5 py-0.5 rounded-full font-semibold shrink-0">
            16:9 Ratio
          </span>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="banner-title" className="text-xs font-semibold text-foreground">
                Banner Headline / Greeting (Optional)
              </Label>
              <Input
                id="banner-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Happy Diwali! or Special 10% Investor Bonus"
                className="text-xs h-9 bg-secondary/60 border-border"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="banner-desc" className="text-xs font-semibold text-foreground">
                Announcement Subtext / Details (Optional)
              </Label>
              <Input
                id="banner-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Wishing prosperity to our syndicate partners. Bonus valid till Nov 15."
                className="text-xs h-9 bg-secondary/60 border-border"
              />
            </div>
          </div>

          {/* File Upload Dropzone */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Select Image (Max 10MB • Auto-Cropped to 16:9 & Compressed)</span>
              {compressionStats && (
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  {(compressionStats.originalSize / 1024 / 1024).toFixed(2)}MB →{" "}
                  {(compressionStats.compressedSize / 1024).toFixed(0)}KB (
                  {Math.round(
                    ((compressionStats.originalSize - compressionStats.compressedSize) /
                      compressionStats.originalSize) *
                      100
                  )}
                  % saved)
                </span>
              )}
            </Label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-primary/50 bg-secondary/30 hover:bg-secondary/60 rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                {isCompressing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5 stroke-[2]" />
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-foreground">
                  {selectedFile ? selectedFile.name : "Click to select banner image"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  PNG, JPG, WebP up to 10MB. Will be compressed and cropped to 16:9 automatically.
                </p>
              </div>
            </div>
          </div>

          {/* 16:9 Live Preview Box */}
          {previewUrl && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#ff5722]" />
                <span>16:9 Aspect Ratio Preview</span>
              </span>
              <div className="relative w-full aspect-[16/9] max-w-lg rounded-xl overflow-hidden border border-border shadow-md bg-black">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                {(title || description) && (
                  <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                    {title && <h4 className="text-sm font-bold truncate">{title}</h4>}
                    {description && (
                      <p className="text-[11px] text-zinc-300 line-clamp-1">{description}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isUploading || isCompressing || !compressedFile}
              className="rounded-full bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-semibold h-10 px-6 shadow-md cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Uploading to ImageKit...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Publish Banner to Carousel
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Existing Banners Management List */}
      <Card className="p-5 sm:p-6 space-y-4 border-border">
        <div className="flex items-center justify-between pb-3 border-b border-border/70">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              Current Carousel Banners ({banners.length})
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Active banners are automatically rotated on the landing page and dashboard.
            </p>
          </div>
        </div>

        {banners.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-border rounded-xl space-y-2">
            <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
            <p className="text-xs font-medium text-foreground">No carousel banners active</p>
            <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
              Upload your first festival greeting or bonus notification banner above. The carousel will automatically appear on the landing page and dashboard once an image is added.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="rounded-xl border border-border bg-secondary/30 overflow-hidden flex flex-col justify-between group shadow-xs hover:border-primary/40 transition-all"
              >
                {/* 16:9 Thumbnail */}
                <div className="relative w-full aspect-[16/9] bg-black">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title || "Banner"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                        banner.active
                          ? "bg-emerald-500/90 text-white shadow-xs"
                          : "bg-zinc-700/90 text-zinc-300"
                      }`}
                    >
                      {banner.active ? "Active" : "Hidden"}
                    </span>
                  </div>
                </div>

                {/* Banner details & actions */}
                <div className="p-3.5 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-foreground truncate">
                      {banner.title || "Untitled Banner"}
                    </h4>
                    {banner.description && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                        {banner.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/60">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(banner._id, banner.active)}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer font-medium"
                      title={banner.active ? "Hide from carousel" : "Show in carousel"}
                    >
                      {banner.active ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                          <span>Hide</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Activate</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(banner._id)}
                      className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer font-medium p-1 rounded-md hover:bg-rose-500/10 transition-colors"
                      title="Delete from ImageKit and Carousel"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

