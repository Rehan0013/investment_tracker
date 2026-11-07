"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { MonthlyChart } from "./MonthlyChart";
import { SettleInvestmentDialog } from "./SettleInvestmentDialog";
import { getMonthlyBreakdown, getCurrentProgress } from "@/lib/utils";
import { reopenInvestment } from "@/actions/investment.actions";
import { toast } from "sonner";
import {
  CheckCircle2,
  RotateCcw,
  Calendar,
  Phone,
  ShieldCheck,
  Sparkles,
  Clock,
  AlertCircle,
  Landmark,
  Edit3,
  User,
  Hash,
  Building2,
  Copy,
  Check,
} from "lucide-react";

export function InvestmentDetail({ investment }: { investment: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [investmentData, setInvestmentData] = useState(investment);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [tableMode, setTableMode] = useState<"accrued" | "all">("accrued");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isPaid = Boolean(investmentData.isPaid);
  const hasBankDetails = Boolean(
    investmentData.accountNo || investmentData.bankName || investmentData.ifscCode
  );
  const roi = investmentData.roi !== undefined ? investmentData.roi : 50;
  const monthlyData = getMonthlyBreakdown(investmentData.amount, new Date(investmentData.investingDate), roi);
  const progress = getCurrentProgress(investmentData.amount, new Date(investmentData.investingDate), roi);
  const isMatured = new Date() >= new Date(investmentData.returnDate);
  const netProfit = investmentData.returnAmount - investmentData.amount;
  const initial = investmentData.investorName?.charAt(0)?.toUpperCase() || "I";
  const now = new Date();

  // Filter: strictly only months whose date has already crossed / elapsed
  const crossedMonths = useMemo(() => {
    return monthlyData.filter((item) => new Date(item.date) <= now);
  }, [monthlyData, now]);

  const displayedTableData = useMemo(() => {
    if (tableMode === "accrued") {
      // If investment was just booked and no full month has crossed yet, show month 1 as active period
      return crossedMonths.length > 0 ? crossedMonths : monthlyData.slice(0, 1);
    }
    return monthlyData;
  }, [tableMode, crossedMonths, monthlyData]);

  const totalProfitInTable = displayedTableData.reduce((acc, curr) => acc + curr.interest, 0);
  const latestValuation = displayedTableData.length > 0 ? displayedTableData[displayedTableData.length - 1].closingBalance : investmentData.amount;

  const handleReopen = () => {
    startTransition(async () => {
      const res = await reopenInvestment(investmentData._id);
      if (res.success) {
        setInvestmentData((prev: any) => ({ ...prev, isPaid: false }));
        toast.info("Contract reopened to active status.");
      } else {
        toast.error(res.error || "Failed to reopen contract");
      }
    });
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSettlementSuccess = (updated: any) => {
    if (updated) {
      setInvestmentData(updated);
    } else {
      setInvestmentData((prev: any) => ({ ...prev, isPaid: true, settledAt: new Date() }));
    }
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Dossier Header Card */}
      <Card className="p-4 sm:p-6 border-border shadow-sm bg-card text-card-foreground">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/70">
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center font-bold text-base sm:text-lg shrink-0 shadow-xs">
              {initial}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  {investmentData.investorName}
                </h1>
                {isPaid ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Settled
                  </span>
                ) : isMatured ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full shrink-0">
                    <AlertCircle className="h-3.5 w-3.5" /> Matured (Due)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full shrink-0">
                    <Clock className="h-3.5 w-3.5" /> Active Contract
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">
                Contract ID: {investmentData._id} • Fixed Term 12 Mo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {!isPaid && !isMatured ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs text-muted-foreground font-mono">
                <Clock className="h-3.5 w-3.5 text-blue-500" />
                <span>Matures on {format(new Date(investmentData.returnDate), "dd MMM yyyy")}</span>
              </div>
            ) : !isPaid && isMatured ? (
              <Button
                onClick={() => setIsSettleModalOpen(true)}
                disabled={isPending}
                size="sm"
                className="w-full sm:w-auto justify-center gap-2 text-xs font-semibold shadow-xs cursor-pointer bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white hover:brightness-110"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-white stroke-[2.5]" />
                <span>Mark as Settled</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleReopen}
                  disabled={isPending}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Reopen Contract</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Contract Key Attributes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 pt-5">
          <div className="p-3 sm:p-3.5 rounded-xl bg-secondary/50 border border-border/60">
            <span className="text-[10px] sm:text-[11px] text-muted-foreground uppercase font-semibold">Principal Capital</span>
            <p className="font-mono text-sm sm:text-lg font-bold text-foreground tabular-nums mt-0.5 truncate">
              ₹{investmentData.amount.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-3 sm:p-3.5 rounded-xl bg-secondary/50 border border-border/60">
            <span className="text-[10px] sm:text-[11px] text-muted-foreground uppercase font-semibold">Maturity Payout</span>
            <p className="font-mono text-sm sm:text-lg font-bold text-foreground tabular-nums mt-0.5 truncate">
              ₹{investmentData.returnAmount.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 uppercase font-semibold">Contract Gain</span>
            <p className="font-mono text-sm sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5 truncate">
              +₹{netProfit.toLocaleString("en-IN")} (+{roi}%)
            </p>
          </div>
          <div className="p-3 sm:p-3.5 rounded-xl bg-secondary/50 border border-border/60">
            <span className="text-[10px] sm:text-[11px] text-muted-foreground uppercase font-semibold">Contract Term</span>
            <p className="font-mono text-sm sm:text-lg font-bold text-foreground tabular-nums mt-0.5 truncate">
              12 Months
            </p>
          </div>
        </div>
      </Card>

      {/* Settlement & Payout Banking Record Card - shows when settled OR whenever bank details are on record */}
      {(isPaid || hasBankDetails) && (
        <Card className="p-4 sm:p-5 border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 text-card-foreground shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
                <Landmark className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">
                    Settlement & Bank Payout Details
                  </h3>
                  {isPaid ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Settled & Disbursed
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Banking Recorded (Pending Settlement)
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Official banking credentials recorded for maturity disbursement of ₹{investmentData.returnAmount.toLocaleString("en-IN")}.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettleModalOpen(true)}
              className="text-xs h-8 gap-1.5 border-emerald-500/30 hover:bg-emerald-500/10 text-foreground cursor-pointer self-start sm:self-auto"
            >
              <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Edit Bank Details</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3.5 text-xs font-mono">
            <div className="p-3 rounded-xl bg-card border border-border/80 space-y-1">
              <span className="text-[10px] uppercase font-sans tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-muted-foreground" /> Account Holder
              </span>
              <p className="font-semibold text-foreground truncate text-xs sm:text-sm">
                {investmentData.accountHolderName || investmentData.investorName}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 space-y-1">
              <span className="text-[10px] uppercase font-sans tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground" /> Bank Name
              </span>
              <p className="font-semibold text-foreground truncate text-xs sm:text-sm">
                {investmentData.bankName || "Recorded Bank"}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-sans tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-muted-foreground" /> Account Number
                </span>
                {investmentData.accountNo && (
                  <button
                    onClick={() => handleCopy(investmentData.accountNo, "acc")}
                    className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Copy Account Number"
                  >
                    {copiedField === "acc" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>
              <p className="font-bold text-foreground text-xs sm:text-sm tracking-wider">
                {investmentData.accountNo || "—"}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-sans tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> IFSC Code
                </span>
                {investmentData.ifscCode && (
                  <button
                    onClick={() => handleCopy(investmentData.ifscCode, "ifsc")}
                    className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Copy IFSC Code"
                  >
                    {copiedField === "ifsc" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>
              <p className="font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm uppercase font-mono">
                {investmentData.ifscCode || "—"}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Full payout of ₹{investmentData.returnAmount.toLocaleString("en-IN")} confirmed</span>
            </span>
            {investmentData.settledAt && (
              <span>Settled on {format(new Date(investmentData.settledAt), "dd MMM yyyy, hh:mm a")}</span>
            )}
          </div>
        </Card>
      )}

      {/* Contract Verification & Schedule Details */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4 border-border bg-card text-card-foreground shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
            <Phone className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">Contact Number</span>
          </div>
          <p className="font-mono text-sm font-bold text-foreground">
            {investmentData.mobileNo}
          </p>
        </Card>

        <Card className="p-4 border-border bg-card text-card-foreground shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">Aadhaar Verification</span>
          </div>
          <p className="font-mono text-sm font-bold text-foreground">
            {investmentData.aadharNo ? investmentData.aadharNo.replace(/(\d{4})\d{4}(\d{4})/, "$1 ●●●● $2") : "Not Recorded"}
          </p>
        </Card>

        <Card className="p-4 border-border bg-card text-card-foreground shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
            <Calendar className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">Maturity Date</span>
          </div>
          <p className="font-mono text-sm font-bold text-foreground">
            {format(new Date(investmentData.returnDate), "dd MMM yyyy")}
          </p>
          <span className="text-[10px] text-muted-foreground">
            Initiated on {format(new Date(investmentData.investingDate), "dd MMM yyyy")}
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
      <MonthlyChart data={monthlyData} investingDate={investmentData.investingDate} />

      {/* Accrual Ledger Breakdown Table: strictly shows only elapsed/crossed months by default */}
      <Card className="p-4 sm:p-5 border-border bg-card text-card-foreground shadow-xs">
        <CardHeader className="p-0 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-bold text-foreground">
                  Accrual Ledger Schedule
                </CardTitle>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {crossedMonths.length} Months Elapsed
                </span>
              </div>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {tableMode === "accrued" ? (
                  <>
                    Showing accrued monthly return up to current month (Realized:{" "}
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      +₹{totalProfitInTable.toLocaleString("en-IN")}
                    </strong>
                    )
                  </>
                ) : (
                  "Full 12-month compounding and distribution schedule"
                )}
              </CardDescription>
            </div>

            {/* Toggle: Accrued vs Full Projection */}
            <div className="w-full sm:w-auto grid grid-cols-2 sm:flex items-center bg-secondary p-1 rounded-full border border-border text-xs">
              <button
                onClick={() => setTableMode("accrued")}
                className={`text-center px-2 sm:px-3 py-1 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap text-[11px] sm:text-xs ${
                  tableMode === "accrued"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Accrued ({crossedMonths.length} Mo)
              </button>
              <button
                onClick={() => setTableMode("all")}
                className={`text-center px-2 sm:px-3 py-1 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap text-[11px] sm:text-xs ${
                  tableMode === "all"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Full (12 Mo)
              </button>
            </div>
          </div>
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
                {displayedTableData.map((item, idx) => {
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
              <TableFooter className="bg-secondary/40 font-mono text-xs">
                <TableRow>
                  <TableCell colSpan={3} className="py-2.5 pl-2 font-sans font-semibold text-foreground">
                    Total Elapsed Valuation (Through {displayedTableData.length} Periods)
                  </TableCell>
                  <TableCell className="py-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    +₹{totalProfitInTable.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="py-2.5 text-right font-bold text-foreground pr-2">
                    ₹{latestValuation.toLocaleString("en-IN")}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Settle Investment Banking Modal */}
      <SettleInvestmentDialog
        open={isSettleModalOpen}
        onOpenChange={setIsSettleModalOpen}
        investment={investmentData}
        onSuccess={handleSettlementSuccess}
      />
    </div>
  );
}
