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

export function InvestmentForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateInvestmentInput>({
    resolver: zodResolver(CreateInvestmentSchema),
    defaultValues: {
      investingDate: new Date(),
    }
  });

  const amount = watch("amount") || 0;
  const investingDateStr = watch("investingDate");
  const investingDate = investingDateStr ? new Date(investingDateStr) : new Date();

  const returnAmount = amount * 1.5;
  const profit = amount * 0.5;

  const returnDate = new Date(investingDate);
  if (!isNaN(returnDate.getTime())) {
    returnDate.setFullYear(returnDate.getFullYear() + 1);
  }

  const onSubmit = (data: CreateInvestmentInput) => {
    startTransition(async () => {
      const res = await createInvestment(data);
      if (res.success) {
        toast.success("Investment added successfully");
        router.push("/investments");
      } else {
        toast.error(res.error || "Failed to add investment");
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-border bg-surface shadow-md">
        <CardHeader>
          <CardTitle>Investment Details</CardTitle>
          <CardDescription>Enter the investor and payment information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="inv-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="investorName">Investor Name</Label>
              <Input id="investorName" {...register("investorName")} className="bg-input focus-visible:ring-primary" />
              {errors.investorName && <p className="text-xs text-danger">{errors.investorName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                {...register("amount", { valueAsNumber: true })}
                className="bg-input focus-visible:ring-primary"
              />
              {errors.amount && <p className="text-xs text-danger">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNo">Mobile Number</Label>
              <Input
                id="mobileNo"
                type="tel"
                inputMode="numeric"
                {...register("mobileNo")}
                className="bg-input focus-visible:ring-primary"
              />
              {errors.mobileNo && <p className="text-xs text-danger">{errors.mobileNo.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="aadharNo">Aadhar Number</Label>
              <Input
                id="aadharNo"
                type="number"
                {...register("aadharNo")}
                className="bg-input focus-visible:ring-primary"
              />
              {errors.aadharNo && <p className="text-xs text-danger">{errors.aadharNo.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="investingDate">Investing Date</Label>
              <Input
                id="investingDate"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                {...register("investingDate", { valueAsDate: true })}
                className="bg-input focus-visible:ring-primary w-full"
              />
              {errors.investingDate && <p className="text-xs text-danger">{errors.investingDate.message}</p>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border bg-surface h-fit shadow-md">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Estimated returns based on amount and date.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-background rounded-lg border border-border space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-muted-foreground">Amount Invested</span>
              <span className="font-bold text-lg">₹{amount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-muted-foreground">Expected Profit (50%)</span>
              <span className="font-bold text-success">₹{profit.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-center pb-1">
              <span className="text-muted-foreground">Total Return</span>
              <span className="font-bold text-xl text-primary">₹{returnAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-background rounded-lg border border-border text-center">
              <p className="text-xs text-muted-foreground mb-1">Investing Date</p>
              <p className="font-medium text-sm">
                {!isNaN(investingDate.getTime()) ? format(investingDate, "dd MMM yyyy") : "Invalid Date"}
              </p>
            </div>
            <div className="p-3 bg-background rounded-lg border border-border text-center">
              <p className="text-xs text-muted-foreground mb-1">Return Date</p>
              <p className="font-medium text-sm text-primary">
                {!isNaN(returnDate.getTime()) ? format(returnDate, "dd MMM yyyy") : "Invalid Date"}
              </p>
            </div>
          </div>

          <Button type="submit" form="inv-form" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-12" disabled={isPending}>
            {isPending ? "Creating..." : "Save Investment"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
