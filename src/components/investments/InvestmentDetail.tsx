"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MonthlyChart } from "./MonthlyChart";
import { getMonthlyBreakdown, getCurrentProgress } from "@/lib/utils";
import { togglePaymentStatus } from "@/actions/investment.actions";
import { toast } from "sonner";
import { CheckCircle2, RotateCcw, Calendar, Phone, ShieldCheck, Sparkles, Clock, AlertCircle } from "lucide-react";

export function InvestmentDetail({ investment }: { investment: any }) {
  const [isPending, startTransition] = useTransition();
  const [isPaid, setIsPaid] = useState(investment.isPaid);

  const roi = investment.roi !== undefined ? investment.roi : 50;
  const monthlyData = getMonthlyBreakdown(investment.amount, new Date(investment.investingDate), roi);
  const progress = getCurrentProgress(investment.amount, new Date(investment.investingDate), roi);
  const isMatured = new Date() >= new Date(investment.returnDate);
  const netProfit = investment.returnAmount - investment.amount;
  const initial = investment.investorName?.charAt(0)?.toUpperCase() || "I";
  const now = new Date();

  const handleTogglePayment = () => {
    startTransition(async () => {
      const res = await togglePaymentStatus(investment._id);
      if (res.success) {
        setIsPaid(res.isPaid);
        if (res.isPaid) {
          toast.success("Contract settled successfully! Payout confirmed.", {
            description: `Full contractual maturity payment of ₹${investment.returnAmount.toLocaleString("en-IN")} recorded.`,
          });
        } else {
          toast.info("Contract reopened to active status.");
        }
      } else {
        toast.error("Failed to update contract status");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Dossier Header Card */}
      <Card className="p-6 border-border shadow-sm bg-card text-card-foreground">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/70">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center font-bold text-lg shadow-xs">
              {initial}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {investment.investorName}
                </h1>
                {isPaid ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Settled
                  </span>
                ) : isMatured ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                    <AlertCircle className="h-3.5 w-3.5" /> Matured (Due)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                    <Clock className="h-3.5 w-3.5" /> Active Contract
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                Contract ID: {investment._id} • Fixed Term 12 Mo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={handleTogglePayment}
              disabled={isPending}
              variant={isPaid ? "outline" : "default"}
              size="sm"
              className={`gap-2 text-xs font-semibold shadow-xs cursor-pointer ${
                !isPaid
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:brightness-110"
                  : ""
              }`}
            >
              {isPaid ? (
                <>
                  <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                  Reopen Contract
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                  Mark as Settled
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Contract Key Attributes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
          <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/60">
            <span className="text-[11px] text-muted-foreground uppercase font-semibold">Principal Capital</span>
            <p className="font-mono text-base sm:text-lg font-bold text-foreground tabular-nums mt-0.5">
              ₹{investment.amount.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/60">
            <span className="text-[11px] text-muted-foreground uppercase font-semibold">Maturity Payout</span>
            <p className="font-mono text-base sm:text-lg font-bold text-foreground tabular-nums mt-0.5">
              ₹{investment.returnAmount.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 uppercase font-semibold">Contract Gain</span>
            <p className="font-mono text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">
              +₹{netProfit.toLocaleString("en-IN")} (+{roi}%)
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/60">
            <span className="text-[11px] text-muted-foreground uppercase font-semibold">Contract Term</span>
            <p className="font-mono text-base sm:text-lg font-bold text-foreground tabular-nums mt-0.5">
              12 Months
            </p>
          </div>
        </div>
      </Card>

      {/* Contract Verification & Schedule Details */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4 border-border bg-card text-card-foreground shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
            <Phone className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">Contact Number</span>
          </div>
          <p className="font-mono text-sm font-bold text-foreground">
            {investment.mobileNo}
          </p>
        </Card>

        <Card className="p-4 border-border bg-card text-card-foreground shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">Aadhaar Verification</span>
          </div>
          <p className="font-mono text-sm font-bold text-foreground">
            {investment.aadharNo ? investment.aadharNo.replace(/(\d{4})\d{4}(\d{4})/, "$1 ●●●● $2") : "Not Recorded"}
          </p>
        </Card>

        <Card className="p-4 border-border bg-card text-card-foreground shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
            <Calendar className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">Maturity Date</span>
          </div>
          <p className="font-mono text-sm font-bold text-foreground">
            {format(new Date(investment.returnDate), "dd MMM yyyy")}
          </p>
          <span className="text-[10px] text-muted-foreground">
            Initiated on {format(new Date(investment.investingDate), "dd MMM yyyy")}
          </span>
        </Card>
      </div>

      {/* Lifecycle Progress Bar */}
      <Card className="p-5 border-border bg-card text-card-foreground space-y-3 shadow-xs">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-orange-500" />
            <span className="font-semibold text-foreground">Contract Lifecycle Progression</span>
          </div>
          <span className="font-mono text-muted-foreground">
            {progress.monthsElapsed} of 12 Months Elapsed ({progress.percentageComplete}%)
          </span>
        </div>
        <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isPaid
                ? "bg-emerald-500"
                : isMatured
                ? "bg-amber-500"
                : "bg-gradient-to-r from-orange-500 to-amber-500"
            }`}
            style={{ width: `${Math.min(progress.percentageComplete, 100)}%` }}
          />
        </div>
      </Card>

      {/* Monthly Chart: displays ONLY up to the current crossed month */}
      <MonthlyChart data={monthlyData} investingDate={investment.investingDate} />

      {/* Accrual Ledger Breakdown Table */}
      <Card className="p-5 border-border bg-card text-card-foreground shadow-xs">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-sm font-bold text-foreground">
            Accrual Ledger Schedule
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Month-by-month compounding and distribution schedule
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-secondary/80 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold text-muted-foreground py-2.5 pl-2">
                    Period
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground py-2.5 text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground py-2.5 text-right">
                    Opening Capital
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground py-2.5 text-right">
                    Monthly Profit
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground py-2.5 text-right pr-2">
                    Closing Valuation
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyData.map((item, idx) => {
                  const itemDate = new Date(item.date);
                  const isCrossed = itemDate <= now;
                  const isCurrentMonth = item.month === progress.monthsElapsed;

                  return (
                    <TableRow
                      key={idx}
                      className={`border-b border-border/60 hover:bg-muted/40 font-mono text-xs tabular-nums transition-colors ${
                        isCurrentMonth ? "bg-orange-500/10 font-semibold" : ""
                      }`}
                    >
                      <TableCell className="py-2.5 pl-2 text-foreground font-sans flex items-center gap-2">
                        <span>{format(itemDate, "MMMM yyyy")} (Month {item.month})</span>
                      </TableCell>
                      <TableCell className="py-2.5 text-center">
                        {isCrossed ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.2 rounded-full">
                            <CheckCircle2 className="h-2.5 w-2.5" /> Accrued
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-muted border border-border px-2 py-0.2 rounded-full">
                            <Clock className="h-2.5 w-2.5" /> Scheduled
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-2.5 text-right text-muted-foreground">
                        ₹{item.openingBalance.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                        +₹{item.interest.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="py-2.5 text-right font-bold text-foreground pr-2">
                        ₹{item.closingBalance.toLocaleString("en-IN")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
