"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateInvestmentSchema, UpdateInvestmentInput } from "@/types";
import { updateInvestment } from "@/actions/investment.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { useTransition, useState, useEffect } from "react";
import { toast } from "sonner";
import { Edit } from "lucide-react";
import { format } from "date-fns";

export function InvestmentEditSheet({
  investment,
  onSuccess,
}: {
  investment: any;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateInvestmentInput>({
    resolver: zodResolver(UpdateInvestmentSchema),
    defaultValues: {
      investorName: investment.investorName,
      amount: investment.amount,
      roi: investment.roi !== undefined ? investment.roi : 50,
      investorBonus: investment.investorBonus || 0,
      ownerBonus: investment.ownerBonus || 0,
      mobileNo: investment.mobileNo,
      aadharNo: investment.aadharNo,
      investingDate: format(new Date(investment.investingDate), "yyyy-MM-dd") as unknown as Date,
      returnDate: investment.returnDate
        ? (format(new Date(investment.returnDate), "yyyy-MM-dd") as unknown as Date)
        : undefined,
      accountHolderName: investment.accountHolderName || "",
      bankName: investment.bankName || "",
      accountNo: investment.accountNo || "",
      ifscCode: investment.ifscCode || "",
    },
  });

  useEffect(() => {
    reset({
      investorName: investment.investorName,
      amount: investment.amount,
      roi: investment.roi !== undefined ? investment.roi : 50,
      investorBonus: investment.investorBonus || 0,
      ownerBonus: investment.ownerBonus || 0,
      mobileNo: investment.mobileNo,
      aadharNo: investment.aadharNo,
      investingDate: format(new Date(investment.investingDate), "yyyy-MM-dd") as unknown as Date,
      returnDate: investment.returnDate
        ? (format(new Date(investment.returnDate), "yyyy-MM-dd") as unknown as Date)
        : undefined,
      accountHolderName: investment.accountHolderName || "",
      bankName: investment.bankName || "",
      accountNo: investment.accountNo || "",
      ifscCode: investment.ifscCode || "",
    });
  }, [investment, reset]);

  const onSubmit = (data: UpdateInvestmentInput) => {
    startTransition(async () => {
      const res = await updateInvestment(investment._id, data);
      if (res.success) {
        toast.success("Investment record updated successfully");
        setOpen(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.error || "Failed to update investment");
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-border bg-card text-foreground hover:bg-muted transition-colors cursor-pointer">
          <Edit className="w-3.5 h-3.5" /> Edit
        </span>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85dvh] sm:h-full sm:w-[420px] overflow-y-auto bg-card border-border p-4 sm:p-6 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-sm font-semibold text-foreground">Edit Investment Position</SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Modify investor information, principal amount, or contractual dates.
          </SheetDescription>
        </SheetHeader>

        <form id="edit-inv-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-investorName" className="text-xs font-medium text-foreground">
              Investor Full Name
            </Label>
            <Input id="edit-investorName" {...register("investorName")} />
            {errors.investorName && <p className="text-xs text-destructive">{errors.investorName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-amount" className="text-xs font-medium text-foreground">
              Principal Amount (₹)
            </Label>
            <Input
              id="edit-amount"
              type="number"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-roi" className="text-xs font-medium text-foreground">
              Expected ROI Tier
            </Label>
            <select
              id="edit-roi"
              {...register("roi", { valueAsNumber: true })}
              className="h-9 w-full rounded-md border border-input bg-card px-3 py-1.5 text-xs text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            >
              <option value={50}>50% Contractual ROI (1.5x)</option>
              <option value={100}>100% Contractual ROI (2.0x)</option>
            </select>
            {errors.roi && <p className="text-xs text-destructive">{errors.roi.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-mobileNo" className="text-xs font-medium text-foreground">
              Mobile Number
            </Label>
            <Input
              id="edit-mobileNo"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              {...register("mobileNo")}
            />
            {errors.mobileNo && <p className="text-xs text-destructive">{errors.mobileNo.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-aadharNo" className="text-xs font-medium text-foreground">
              Aadhaar Number
            </Label>
            <Input
              id="edit-aadharNo"
              type="text"
              maxLength={12}
              {...register("aadharNo")}
            />
            {errors.aadharNo && <p className="text-xs text-destructive">{errors.aadharNo.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-investingDate" className="text-xs font-medium text-foreground">
              Investing Date
            </Label>
            <Input
              id="edit-investingDate"
              type="date"
              max={new Date().toISOString().split("T")[0]}
              {...register("investingDate", { valueAsDate: true })}
            />
            {errors.investingDate && <p className="text-xs text-destructive">{errors.investingDate.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-returnDate" className="text-xs font-medium text-foreground">
              Return Date (Optional)
            </Label>
            <Input
              id="edit-returnDate"
              type="date"
              min={investment.investingDate ? new Date(investment.investingDate).toISOString().split("T")[0] : undefined}
              {...register("returnDate", { valueAsDate: true })}
            />
            {errors.returnDate && <p className="text-xs text-destructive">{errors.returnDate.message}</p>}
          </div>

          {/* Bonus Allocations */}
          <div className="pt-3 border-t border-border/70 space-y-3">
            <span className="text-xs font-semibold text-foreground block">
              Incentive Bonuses
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-investorBonus" className="text-xs font-medium text-foreground">
                  Investor Bonus (₹)
                </Label>
                <Input
                  id="edit-investorBonus"
                  type="number"
                  min="0"
                  {...register("investorBonus", { valueAsNumber: true })}
                />
                <span className="text-[10px] text-muted-foreground block">
                  Added to investor profit
                </span>
                {errors.investorBonus && (
                  <p className="text-xs text-destructive">{errors.investorBonus.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-ownerBonus" className="text-xs font-medium text-foreground">
                  Owner Bonus (₹)
                </Label>
                <Input
                  id="edit-ownerBonus"
                  type="number"
                  min="0"
                  {...register("ownerBonus", { valueAsNumber: true })}
                />
                <span className="text-[10px] text-muted-foreground block">
                  Owner's commission
                </span>
                {errors.ownerBonus && (
                  <p className="text-xs text-destructive">{errors.ownerBonus.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border/70 space-y-3">
            <span className="text-xs font-semibold text-foreground block">
              Investor Banking & Payout Details
            </span>

            <div className="space-y-1.5">
              <Label htmlFor="edit-accountHolderName" className="text-xs font-medium text-foreground">
                Account Holder Name
              </Label>
              <Input id="edit-accountHolderName" placeholder="Full name as in bank account" {...register("accountHolderName")} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-bankName" className="text-xs font-medium text-foreground">
                Bank Name
              </Label>
              <Input id="edit-bankName" placeholder="e.g. State Bank of India, HDFC Bank" {...register("bankName")} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-accountNo" className="text-xs font-medium text-foreground">
                  Account Number
                </Label>
                <Input id="edit-accountNo" placeholder="Bank account no." {...register("accountNo")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-ifscCode" className="text-xs font-medium text-foreground">
                  IFSC Code
                </Label>
                <Input id="edit-ifscCode" placeholder="e.g. SBIN0001234" className="uppercase font-mono" {...register("ifscCode")} />
              </div>
            </div>
          </div>

          <div className="pt-3 flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              className="flex-1 text-xs"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="flex-1 text-xs"
              disabled={isPending}
            >
              {isPending ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
