"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateInvestmentSchema, UpdateInvestmentInput } from "@/types";
import { updateInvestment } from "@/actions/investment.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { useTransition, useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Edit,
  User,
  Phone,
  ShieldCheck,
  Calendar,
  Landmark,
  Gift,
  Coins,
  Building2,
  Hash,
} from "lucide-react";
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
      investingDate: format(
        new Date(investment.investingDate),
        "yyyy-MM-dd"
      ) as unknown as Date,
      returnDate: investment.returnDate
        ? (format(
            new Date(investment.returnDate),
            "yyyy-MM-dd"
          ) as unknown as Date)
        : undefined,
      accountHolderName: investment.accountHolderName || "",
      bankName: investment.bankName || "",
      accountNo: investment.accountNo || "",
      ifscCode: investment.ifscCode || "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        investorName: investment.investorName,
        amount: investment.amount,
        roi: investment.roi !== undefined ? investment.roi : 50,
        investorBonus: investment.investorBonus || 0,
        ownerBonus: investment.ownerBonus || 0,
        mobileNo: investment.mobileNo,
        aadharNo: investment.aadharNo,
        investingDate: format(
          new Date(investment.investingDate),
          "yyyy-MM-dd"
        ) as unknown as Date,
        returnDate: investment.returnDate
          ? (format(
              new Date(investment.returnDate),
              "yyyy-MM-dd"
            ) as unknown as Date)
          : undefined,
        accountHolderName: investment.accountHolderName || "",
        bankName: investment.bankName || "",
        accountNo: investment.accountNo || "",
        ifscCode: investment.ifscCode || "",
      });
    }
  }, [open, investment, reset]);

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

      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden bg-card border-l border-border shadow-2xl"
      >
        {/* Pinned Sticky Header */}
        <div className="p-4 sm:p-5 border-b border-border/80 shrink-0 bg-card z-10 pr-12">
          <SheetHeader className="p-0">
            <SheetTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center">
                <Edit className="w-3.5 h-3.5" />
              </div>
              <span>Edit Investment Position</span>
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground mt-0.5">
              Update investor profile, contractual capital terms, bonuses, or bank payout details.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Scrollable Form Body Container */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-6">
          <form
            id="edit-inv-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Section 1: Investor Identification */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground pb-1 border-b border-border/50">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Investor Information</span>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-investorName"
                  className="text-xs font-medium text-foreground"
                >
                  Investor Full Name *
                </Label>
                <Input
                  id="edit-investorName"
                  placeholder="e.g. Ramesh Kumar"
                  {...register("investorName")}
                />
                {errors.investorName && (
                  <p className="text-xs text-destructive">
                    {errors.investorName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="edit-mobileNo"
                    className="text-xs font-medium text-foreground flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-muted-foreground" />
                    <span>Mobile Number *</span>
                  </Label>
                  <Input
                    id="edit-mobileNo"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit mobile"
                    {...register("mobileNo")}
                  />
                  {errors.mobileNo && (
                    <p className="text-xs text-destructive">
                      {errors.mobileNo.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="edit-aadharNo"
                    className="text-xs font-medium text-foreground flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3 h-3 text-muted-foreground" />
                    <span>Aadhaar Number *</span>
                  </Label>
                  <Input
                    id="edit-aadharNo"
                    type="text"
                    inputMode="numeric"
                    maxLength={12}
                    placeholder="12-digit Aadhaar"
                    {...register("aadharNo")}
                  />
                  {errors.aadharNo && (
                    <p className="text-xs text-destructive">
                      {errors.aadharNo.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Capital Terms & Dates */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground pb-1 border-b border-border/50">
                <Coins className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Capital & Contract Terms</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="edit-amount"
                    className="text-xs font-medium text-foreground"
                  >
                    Principal Amount (₹) *
                  </Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    min="1"
                    placeholder="e.g. 50000"
                    {...register("amount", { valueAsNumber: true })}
                  />
                  {errors.amount && (
                    <p className="text-xs text-destructive">
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="edit-roi"
                    className="text-xs font-medium text-foreground"
                  >
                    Expected ROI Tier *
                  </Label>
                  <select
                    id="edit-roi"
                    {...register("roi", { valueAsNumber: true })}
                    className="h-9 w-full rounded-md border border-input bg-card px-3 py-1.5 text-xs text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                  >
                    <option value={50}>50% Contractual ROI (1.5x)</option>
                    <option value={100}>100% Contractual ROI (2.0x)</option>
                  </select>
                  {errors.roi && (
                    <p className="text-xs text-destructive">
                      {errors.roi.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="edit-investingDate"
                    className="text-xs font-medium text-foreground flex items-center gap-1"
                  >
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span>Investing Date *</span>
                  </Label>
                  <Input
                    id="edit-investingDate"
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    {...register("investingDate", { valueAsDate: true })}
                  />
                  {errors.investingDate && (
                    <p className="text-xs text-destructive">
                      {errors.investingDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="edit-returnDate"
                    className="text-xs font-medium text-foreground flex items-center gap-1"
                  >
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span>Return Date (Optional)</span>
                  </Label>
                  <Input
                    id="edit-returnDate"
                    type="date"
                    min={
                      investment.investingDate
                        ? new Date(investment.investingDate)
                            .toISOString()
                            .split("T")[0]
                        : undefined
                    }
                    {...register("returnDate", { valueAsDate: true })}
                  />
                  {errors.returnDate && (
                    <p className="text-xs text-destructive">
                      {errors.returnDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Incentive Bonus Allocations */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground pb-1 border-b border-border/50">
                <Gift className="w-3.5 h-3.5 text-orange-500" />
                <span>Incentive Bonuses</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="edit-investorBonus"
                    className="text-xs font-medium text-foreground"
                  >
                    Investor Bonus (₹)
                  </Label>
                  <Input
                    id="edit-investorBonus"
                    type="number"
                    min="0"
                    placeholder="0"
                    {...register("investorBonus", { valueAsNumber: true })}
                  />
                  <span className="text-[10px] text-muted-foreground block">
                    Added to investor net profit payout
                  </span>
                  {errors.investorBonus && (
                    <p className="text-xs text-destructive">
                      {errors.investorBonus.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="edit-ownerBonus"
                    className="text-xs font-medium text-foreground"
                  >
                    Owner Bonus (₹)
                  </Label>
                  <Input
                    id="edit-ownerBonus"
                    type="number"
                    min="0"
                    placeholder="0"
                    {...register("ownerBonus", { valueAsNumber: true })}
                  />
                  <span className="text-[10px] text-muted-foreground block">
                    Syndicate owner earnings/commission
                  </span>
                  {errors.ownerBonus && (
                    <p className="text-xs text-destructive">
                      {errors.ownerBonus.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: Investor Banking & Payout Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground pb-1 border-b border-border/50">
                <Landmark className="w-3.5 h-3.5 text-emerald-500" />
                <span>Investor Banking & Settlement Details</span>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-accountHolderName"
                  className="text-xs font-medium text-foreground flex items-center gap-1"
                >
                  <User className="w-3 h-3 text-muted-foreground" />
                  <span>Account Holder Name</span>
                </Label>
                <Input
                  id="edit-accountHolderName"
                  placeholder="Full name as in bank account"
                  {...register("accountHolderName")}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-bankName"
                  className="text-xs font-medium text-foreground flex items-center gap-1"
                >
                  <Building2 className="w-3 h-3 text-muted-foreground" />
                  <span>Bank Name</span>
                </Label>
                <Input
                  id="edit-bankName"
                  placeholder="e.g. State Bank of India, HDFC Bank, ICICI"
                  {...register("bankName")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="edit-accountNo"
                    className="text-xs font-medium text-foreground flex items-center gap-1"
                  >
                    <Hash className="w-3 h-3 text-muted-foreground" />
                    <span>Account Number</span>
                  </Label>
                  <Input
                    id="edit-accountNo"
                    placeholder="Bank account number"
                    {...register("accountNo")}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="edit-ifscCode"
                    className="text-xs font-medium text-foreground"
                  >
                    IFSC Code
                  </Label>
                  <Input
                    id="edit-ifscCode"
                    placeholder="e.g. SBIN0001234"
                    className="uppercase font-mono"
                    {...register("ifscCode")}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Pinned Sticky Footer */}
        <div className="p-4 sm:p-5 border-t border-border/80 shrink-0 bg-card/95 backdrop-blur-sm z-10 flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            className="flex-1 text-xs h-9 cursor-pointer"
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="edit-inv-form"
            size="sm"
            className="flex-1 text-xs h-9 bg-gradient-to-r from-[#ff6b35] via-[#ff5722] to-[#e64a19] hover:brightness-110 text-white font-semibold shadow-xs cursor-pointer"
            disabled={isPending}
          >
            {isPending ? "Updating Position..." : "Save Changes"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
