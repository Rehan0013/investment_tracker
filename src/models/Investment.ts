import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema(
  {
    investorName: { type: String, required: true },
    amount: { type: Number, required: true },
    roi: { type: Number, required: true, default: 50, enum: [50, 100] },
    mobileNo: { type: String, required: true, match: /^[6-9]\d{9}$/ },
    aadharNo: { type: String, required: true, match: /^\d{12}$/ },
    investingDate: { type: Date, required: true, default: Date.now },
    returnDate: { type: Date, required: true },
    returnAmount: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Bonuses
    investorBonus: { type: Number, default: 0 },
    ownerBonus: { type: Number, default: 0 },
    // Settlement Payout Banking Details
    accountHolderName: { type: String, default: "" },
    accountNo: { type: String, default: "" },
    ifscCode: { type: String, default: "" },
    bankName: { type: String, default: "" },
    settledAt: { type: Date },
  },
  { timestamps: true, strict: false }
);

// If the model was previously compiled without the new settlement fields, delete it so it recompiles with the latest schema
if (mongoose.models && mongoose.models.Investment) {
  delete (mongoose.models as any).Investment;
}

export default mongoose.models.Investment || mongoose.model("Investment", InvestmentSchema);
