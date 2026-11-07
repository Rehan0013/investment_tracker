"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateInvestmentSchema, CreateInvestmentInput } from "@/types";
import { createInvestment } from "@/actions/investment.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowRight, Calculator } from "lucide-react";

export function InvestmentForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateInvestmentInput>({
    resolver: zodResolver(CreateInvestmentSchema),
    defaultValues: {
      investingDate: new Date(),
      roi: 50,
    },
  });

  const amount = watch("amount") || 0;
  const roi = watch("roi") || 50;
  const investingDateStr = watch("investingDate");
  const investingDate = investingDateStr ? new Date(investingDateStr) : new Date();
  const customReturnDate = watch("returnDate");

  const multiplier = roi === 100 ? 2.0 : 1.5;
  const returnAmount = amount * multiplier;
  const profit = amount * (roi / 100);
  const monthlyAccrual = amount > 0 ? profit / 12 : 0;

  let returnDate =
    customReturnDate && !isNaN(new Date(customReturnDate).getTime())
      ? new Date(customReturnDate)
      : new Date(investingDate);

  if (!customReturnDate || isNaN(new Date(customReturnDate).getTime())) {
    if (!isNaN(returnDate.getTime())) {
      returnDate.setFullYear(returnDate.getFullYear() + 1);
    }
  }

  const onSubmit = (data: CreateInvestmentInput) => {
    startTransition(async () => {
      const res = await createInvestment(data);
      if (res.success) {
        toast.success("Investment contract successfully created");
        router.push("/investments");
      } else {
        toast.error(res.error || "Failed to create investment record");
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12 items-start">
      {/* Form Details (7 cols) */}
      <Card className="p-4 sm:p-5 lg:col-span-7">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-sm font-semibold text-foreground">
            Contract Terms & Investor Details
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Enter investor identification and financial agreement details.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <form id="inv-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="investorName" className="text-xs font-medium text-foreground">
                Investor Full Name *
              </Label>
              <Input
                id="investorName"
                placeholder="e.g. Rehan Ali"
                {...register("investorName")}
              />
              {errors.investorName && (
                <p className="text-xs text-destructive">{errors.investorName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="amount" className="text-xs font-medium text-foreground">
                  Principal Amount (₹) *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="100000"
                  {...register("amount", { valueAsNumber: true })}
                />
                {errors.amount && (
                  <p className="text-xs text-destructive">{errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="roi" className="text-xs font-medium text-foreground">
                  Contractual ROI Tier *
                </Label>
                <select
                  id="roi"
                  {...register("roi", { valueAsNumber: true })}
                  className="h-9 w-full rounded-md border border-input bg-card px-3 py-1.5 text-base sm:text-xs text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                >
                  <option value={50}>50% Contractual ROI (1.5x Multiplier)</option>
                  <option value={100}>100% Contractual ROI (2.0x Multiplier)</option>
                </select>
                {errors.roi && <p className="text-xs text-destructive">{errors.roi.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="mobileNo" className="text-xs font-medium text-foreground">
                  Mobile Number (10 digits) *
                </Label>
                <Input
                  id="mobileNo"
                  type="tel"
                  placeholder="6265123456"
                  maxLength={10}
                  {...register("mobileNo")}
                />
                {errors.mobileNo && (
                  <p className="text-xs text-destructive">{errors.mobileNo.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="aadharNo" className="text-xs font-medium text-foreground">
                  Aadhaar Number (12 digits) *
                </Label>
                <Input
                  id="aadharNo"
                  type="text"
                  placeholder="123456789012"
                  maxLength={12}
                  {...register("aadharNo")}
                />
                {errors.aadharNo && (
                  <p className="text-xs text-destructive">{errors.aadharNo.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <Label htmlFor="investingDate" className="text-xs font-medium text-foreground">
                  Investment Effective Date *
                </Label>
                <Input
                  id="investingDate"
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  {...register("investingDate", { valueAsDate: true })}
                />
                {errors.investingDate && (
                  <p className="text-xs text-destructive">{errors.investingDate.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="returnDate" className="text-xs font-medium text-foreground">
                  Maturity Payout Date (Optional)
                </Label>
                <Input
                  id="returnDate"
                  type="date"
                  min={
                    !isNaN(investingDate.getTime())
                      ? investingDate.toISOString().split("T")[0]
                      : new Date().toISOString().split("T")[0]
                  }
                  {...register("returnDate", { valueAsDate: true })}
                />
                {errors.returnDate && (
                  <p className="text-xs text-destructive">{errors.returnDate.message}</p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Live Financial Calculation Preview (5 cols) */}
      <Card className="p-4 sm:p-5 lg:col-span-5 space-y-5">
        <CardHeader className="p-0 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold text-foreground">
              Contract Valuation Preview
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Computed maturity figures and monthly accrual schedule
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 space-y-4">
          <div className="divide-y divide-border/60 rounded-lg border border-border bg-secondary/30 p-3.5 text-xs font-mono">
            <div className="flex justify-between items-center pb-2.5">
              <span className="text-muted-foreground font-sans">Principal Allocation</span>
              <span className="font-semibold text-foreground tabular-nums">
                ₹{amount.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-muted-foreground font-sans">Contractual Profit (+{roi}%)</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                +₹{profit.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-muted-foreground font-sans">Monthly Accrual Base</span>
              <span className="font-medium text-muted-foreground tabular-nums">
                ~₹{monthlyAccrual.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} / mo
              </span>
            </div>
            <div className="flex justify-between items-center pt-2.5 text-sm">
              <span className="font-medium font-sans text-foreground">Total Maturity Payout</span>
              <span className="font-bold text-foreground tabular-nums">
                ₹{returnAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-border bg-card">
              <p className="text-[10px] text-muted-foreground uppercase font-medium">Initiation</p>
              <p className="font-mono font-medium text-foreground mt-0.5">
                {!isNaN(investingDate.getTime()) ? format(investingDate, "dd MMM yyyy") : "—"}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-border bg-card">
              <p className="text-[10px] text-muted-foreground uppercase font-medium">Maturity Date</p>
              <p className="font-mono font-medium text-foreground mt-0.5">
                {!isNaN(returnDate.getTime()) ? format(returnDate, "dd MMM yyyy") : "—"}
              </p>
            </div>
          </div>

          <Button
            type="submit"
            form="inv-form"
            className="w-full h-10 gap-2 font-medium text-xs"
            disabled={isPending}
          >
            {isPending ? "Recording Position..." : "Confirm & Save Contract"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
