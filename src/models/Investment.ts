import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema(
  {
    investorName: { type: String, required: true },
    amount: { type: Number, required: true },
    mobileNo: { type: String, required: true, match: /^[6-9]\d{9}$/ },
    aadharNo: { type: String, required: true, match: /^\d{12}$/ },
    investingDate: { type: Date, required: true, default: Date.now },
    returnDate: { type: Date, required: true },
    returnAmount: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Investment || mongoose.model("Investment", InvestmentSchema);
