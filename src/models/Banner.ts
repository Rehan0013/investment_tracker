import mongoose from "mongoose";

export interface IBanner {
  _id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  fileId?: string;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    imageUrl: { type: String, required: true },
    fileId: { type: String, default: "" },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models.Banner) {
  delete (mongoose.models as any).Banner;
}

export default mongoose.models.Banner || mongoose.model("Banner", BannerSchema);

