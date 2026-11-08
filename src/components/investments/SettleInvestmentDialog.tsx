"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettleInvestmentSchema, SettleInvestmentInput } from "@/types";
import { settleInvestment } from "@/actions/investment.actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Landmark, CheckCircle2, ShieldCheck, ArrowRight, User, Hash, Building2 } from "lucide-react";

interface SettleInvestmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investment: {
    _id: string;
    investorName: string;
    amount: number;
    returnAmount: number;
    accountHolderName?: string;
    accountNo?: string;
    ifscCode?: string;
    bankName?: string;
  };
  onSuccess?: (updatedInvestment: any) => void;
}

export function SettleInvestmentDialog({
  open,
  onOpenChange,
  investment,
  onSuccess,
}: SettleInvestmentDialogProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SettleInvestmentInput>({
    resolver: zodResolver(SettleInvestmentSchema),
    defaultValues: {
      accountHolderName: investment.accountHolderName || investment.investorName || "",
      bankName: investment.bankName || "",
      accountNo: investment.accountNo || "",
      ifscCode: investment.ifscCode || "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        accountHolderName: investment.accountHolderName || investment.investorName || "",
        bankName: investment.bankName || "",
        accountNo: investment.accountNo || "",
        ifscCode: investment.ifscCode || "",
      });
    }
  }, [open, investment, reset]);

  const onError = (errors: any) => {
    const firstKey = Object.keys(errors)[0];
    if (firstKey && errors[firstKey]?.message) {
      toast.error(errors[firstKey].message);
    }
  };

  const onSubmit = (data: SettleInvestmentInput) => {
    startTransition(async () => {
      const res = await settleInvestment(investment._id, {
        accountHolderName: data.accountHolderName.trim(),
        bankName: data.bankName.trim(),
        accountNo: data.accountNo.trim(),
        ifscCode: data.ifscCode.trim().toUpperCase(),
      });
      if (res.success) {
        toast.success("Investment contract settled successfully!", {
          description: `Payout of ₹${investment.returnAmount.toLocaleString("en-IN")} recorded to ${data.bankName}.`,
        });
        onOpenChange(false);
        if (onSuccess) {
          onSuccess(res.investment);
        }
      } else {
        toast.error(res.error || "Failed to settle investment");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border p-5 sm:p-6 overflow-hidden">
        <DialogHeader className="pb-2 border-b border-border/70">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Landmark className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Settle Matured Investment
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Record investor banking details for maturity disbursement.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Contract Payout Summary Banner */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-secondary/60 border border-border/80 flex items-center justify-between gap-3 text-xs font-mono tabular-nums my-1">
          <div>
            <span className="text-[10px] font-sans uppercase tracking-wider text-muted-foreground font-semibold block">
              Investor
            </span>
            <span className="font-sans font-bold text-foreground text-sm truncate block max-w-[170px] sm:max-w-xs">
              {investment.investorName}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-sans uppercase tracking-wider text-muted-foreground font-semibold block">
              Maturity Payout
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base sm:text-lg">
              ₹{investment.returnAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Settlement Form */}
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-3.5 pt-1">
          {/* Account Holder Name */}
          <div className="space-y-1.5">
            <Label htmlFor="accountHolderName" className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Account Holder Name *</span>
            </Label>
            <Input
              id="accountHolderName"
              placeholder="Full name as in bank account"
              {...register("accountHolderName")}
            />
            {errors.accountHolderName && (
              <p className="text-[11px] text-destructive">{errors.accountHolderName.message}</p>
            )}
          </div>

          {/* Bank Name */}
          <div className="space-y-1.5">
            <Label htmlFor="bankName" className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Bank Name *</span>
            </Label>
            <Input
              id="bankName"
              placeholder="e.g. State Bank of India, HDFC Bank, ICICI Bank"
              {...register("bankName")}
            />
            {errors.bankName && (
              <p className="text-[11px] text-destructive">{errors.bankName.message}</p>
            )}
          </div>

          {/* Account Number & IFSC Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Account Number */}
            <div className="space-y-1.5">
              <Label htmlFor="accountNo" className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Account Number *</span>
              </Label>
              <Input
                id="accountNo"
                type="text"
                placeholder="e.g. 50100456789123"
                {...register("accountNo")}
              />
              {errors.accountNo && (
                <p className="text-[11px] text-destructive">{errors.accountNo.message}</p>
              )}
            </div>

            {/* IFSC Code */}
            <div className="space-y-1.5">
              <Label htmlFor="ifscCode" className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                <span>IFSC Code *</span>
              </Label>
              <Input
                id="ifscCode"
                placeholder="e.g. SBIN0001234"
                className="uppercase font-mono"
                {...register("ifscCode")}
              />
              {errors.ifscCode && (
                <p className="text-[11px] text-destructive">{errors.ifscCode.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-border/70 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="text-xs cursor-pointer w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white gap-2 shadow-xs cursor-pointer w-full sm:w-auto"
            >
              {isPending ? (
                "Recording Settlement..."
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                  <span>Confirm Settlement & Disburse</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

