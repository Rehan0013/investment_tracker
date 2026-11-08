import { z } from "zod";

export const CreateInvestmentSchema = z.object({
  investorName: z.string().min(2, "Name must be at least 2 characters").max(100),
  amount: z.number().positive("Amount must be positive").min(1, "Minimum amount is 1"),
  roi: z.union([z.literal(50), z.literal(100)]),
  mobileNo: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  aadharNo: z.string().regex(/^\d{12}$/, "Aadhar must be 12 digits"),
  investingDate: z.date(),
  returnDate: z.date().optional(),
  investorBonus: z.number().min(0, "Bonus cannot be negative").optional(),
  ownerBonus: z.number().min(0, "Bonus cannot be negative").optional(),
});

export const SettleInvestmentSchema = z.object({
  accountHolderName: z.string().trim().min(2, "Account holder name is required").max(100),
  accountNo: z.string().trim().min(6, "Valid account number is required (min 6 digits)").max(30),
  ifscCode: z
    .string()
    .trim()
    .min(4, "Valid IFSC code is required")
    .max(15)
    .toUpperCase(),
  bankName: z.string().trim().min(2, "Bank name is required").max(100),
});

export const UpdateInvestmentSchema = CreateInvestmentSchema.partial().extend({
  investorBonus: z.number().min(0).optional(),
  ownerBonus: z.number().min(0).optional(),
  accountHolderName: z.string().optional(),
  accountNo: z.string().optional(),
  ifscCode: z.string().optional(),
  bankName: z.string().optional(),
  isPaid: z.boolean().optional(),
});

export type CreateInvestmentInput = z.infer<typeof CreateInvestmentSchema>;
export type UpdateInvestmentInput = z.infer<typeof UpdateInvestmentSchema>;
export type SettleInvestmentInput = z.infer<typeof SettleInvestmentSchema>;
