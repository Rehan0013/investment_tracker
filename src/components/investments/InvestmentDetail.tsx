"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MonthlyChart } from "./MonthlyChart";
import { getMonthlyBreakdown, getCurrentProgress } from "@/lib/utils";
import { togglePaymentStatus } from "@/actions/investment.actions";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function InvestmentDetail({ investment }: { investment: any }) {
  const [isPending, startTransition] = useTransition();
  const [isPaid, setIsPaid] = useState(investment.isPaid);

  const roi = investment.roi !== undefined ? investment.roi : 50;
  const monthlyData = getMonthlyBreakdown(investment.amount, new Date(investment.investingDate), roi);
  const progress = getCurrentProgress(investment.amount, new Date(investment.investingDate), roi);
  const visibleMonths = progress.monthsElapsed === 12 ? 12 : Math.max(1, progress.monthsElapsed);
  const visibleMonthlyData = monthlyData.slice(0, visibleMonths);

  const handleTogglePayment = () => {
    startTransition(async () => {
      const res = await togglePaymentStatus(investment._id);
      if (res.success) {
        setIsPaid(res.isPaid);
        toast.success(`Marked as ${res.isPaid ? 'Paid' : 'Active'}`);
      } else {
        toast.error("Failed to update status");
      }
    });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Section */}
      <Card className="border-border/60 bg-card/60 dark:bg-card/40 backdrop-blur-2xl shadow-2xl mt-4">
        <CardContent className="p-6 relative">
          <div className="grid gap-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold font-mono">Investor Name</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">{investment.investorName}</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-border/40">
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold font-mono">Mobile Number</p>
                <p className="font-bold text-sm text-foreground font-mono">{investment.mobileNo}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold font-mono">Amount</p>
                <p className="font-bold text-sm text-foreground font-mono">₹{investment.amount.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold font-mono">Status</p>
                <Badge className={`px-3 py-1 text-xs font-bold rounded-lg shadow-sm ${isPaid ? "text-success bg-success/10 border border-success/20" : "text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20"}`}>
                  {isPaid ? "Paid" : "Active"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-border/60 bg-card/60 dark:bg-card/40 backdrop-blur-2xl shadow-2xl">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold font-mono">Invested On</p>
            <p className="font-bold text-sm text-foreground font-mono">{format(new Date(investment.investingDate), "dd MMM yyyy")}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60 dark:bg-card/40 backdrop-blur-2xl shadow-2xl">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold font-mono">Returns On</p>
            <p className="font-bold text-sm text-foreground font-mono">{format(new Date(investment.returnDate), "dd MMM yyyy")}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60 dark:bg-card/40 backdrop-blur-2xl col-span-2 shadow-2xl">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold font-mono">Aadhar Number</p>
              <p className="font-bold text-sm font-mono tracking-widest text-foreground">{investment.aadharNo.replace(/(\d{4})\d{4}(\d{4})/, '$1 ●●●● $2')}</p>
            </div>
            <div className="text-right border-l border-border/40 pl-6">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold font-mono">Expected Return</p>
              <p className="font-bold text-base text-success font-mono">₹{investment.returnAmount.toLocaleString("en-IN")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <Card className="border-border/60 bg-card/60 dark:bg-card/40 backdrop-blur-2xl shadow-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-muted-foreground font-mono">{progress.monthsElapsed} of 12 months completed</span>
            <span className="font-bold text-primary font-mono text-base">{progress.percentageComplete}%</span>
          </div>
          <div className="w-full bg-background/80 rounded-full h-3 border border-border/40 overflow-hidden p-0.5 shadow-inner">
            <div
              className="bg-primary h-full rounded-full transition-all duration-1000 ease-in-out shadow-sm"
              style={{ width: `${progress.percentageComplete}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/40 mt-6">
            <div>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Current Value</p>
              <p className="font-bold text-2xl text-foreground font-mono mt-1">₹{progress.currentValue.toLocaleString("en-IN")}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Profit So Far</p>
              <p className="font-bold text-2xl text-success font-mono mt-1">+₹{progress.profitSoFar.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <MonthlyChart data={visibleMonthlyData} />

      {/* Monthly Table */}
      <Card className="border-border/60 bg-card/60 dark:bg-card/40 backdrop-blur-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-transparent border-b border-border/60">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="w-12 text-muted-foreground font-semibold text-xs tracking-wider uppercase font-mono">M</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs tracking-wider uppercase font-mono">Opening</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs tracking-wider uppercase font-mono">Interest</TableHead>
                <TableHead className="text-right text-muted-foreground font-semibold text-xs tracking-wider uppercase font-mono">Closing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleMonthlyData.map((d, i) => (
                <TableRow
                  key={d.month}
                  className={`border-b border-border/40 transition-colors hover:bg-muted/30 ${i + 1 === progress.monthsElapsed && !isPaid ? 'bg-primary/10 font-bold' : ''}`}
                >
                  <TableCell className="font-medium text-xs text-muted-foreground font-mono">{d.month}</TableCell>
                  <TableCell className="text-sm text-foreground font-mono font-semibold">₹{Math.round(d.openingBalance).toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-sm text-success font-mono font-semibold">+₹{Math.round(d.interest).toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-sm text-right font-semibold text-foreground font-mono">₹{Math.round(d.closingBalance).toLocaleString("en-IN")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Action Section */}
      {progress.monthsElapsed === 12 && (
        <div className="fixed bottom-16 left-0 w-full p-4 bg-background/80 backdrop-blur-2xl border-t border-border/60 sm:relative sm:bottom-0 sm:bg-transparent sm:border-0 sm:p-0 z-40">
          <Button
            onClick={handleTogglePayment}
            disabled={isPending}
            variant={isPaid ? "outline" : "default"}
            className={`w-full h-14 text-lg font-bold rounded-2xl shadow-2xl transition-all duration-300 ${!isPaid ? 'bg-success hover:bg-success/90 text-white shadow-success/25' : 'border-border/60 text-foreground hover:bg-muted/30'}`}
          >
            {isPending ? "Updating..." : (isPaid ? "Revert Transfer" : "Money Transferred ✓")}
          </Button>
        </div>
      )}
    </div>
  );
}
