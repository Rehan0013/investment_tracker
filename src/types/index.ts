import { z } from "zod";

export const CreateInvestmentSchema = z.object({
  investorName: z.string().min(2, "Name must be at least 2 characters").max(100),
  amount: z.number().positive("Amount must be positive").min(1, "Minimum amount is 1"),
  mobileNo: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  aadharNo: z.string().regex(/^\d{12}$/, "Aadhar must be 12 digits"),
  investingDate: z.date().max(new Date(), "Date cannot be in future"),
});

export const UpdateInvestmentSchema = CreateInvestmentSchema.partial();

export type CreateInvestmentInput = z.infer<typeof CreateInvestmentSchema>;
export type UpdateInvestmentInput = z.infer<typeof UpdateInvestmentSchema>;
