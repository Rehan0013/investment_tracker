"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MonthlyChart } from "./MonthlyChart";
import { getMonthlyBreakdown, getCurrentProgress } from "@/lib/utils";
import { togglePaymentStatus, deleteInvestment } from "@/actions/investment.actions";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { InvestmentEditSheet } from "./InvestmentEditSheet";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";

export function InvestmentDetail({ investment }: { investment: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isPaid, setIsPaid] = useState(investment.isPaid);

  const monthlyData = getMonthlyBreakdown(investment.amount, new Date(investment.investingDate));
  const progress = getCurrentProgress(investment.amount, new Date(investment.investingDate));
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

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const res = await deleteInvestment(investment._id);
      if (res.success) {
        toast.success("Investment deleted successfully");
        setIsDeleteDialogOpen(false);
        router.push("/investments");
      } else {
        toast.error("Failed to delete investment");
      }
    });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Section */}
      <Card className="border-border/60 bg-card/60 dark:bg-card/40 backdrop-blur-2xl shadow-2xl mt-4">
        <CardContent className="p-6 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <InvestmentEditSheet investment={investment} />
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger render={
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 text-destructive border-border/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors rounded-xl shadow-sm"
                />
              }>
                <Trash2 className="h-4 w-4" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-card/90 backdrop-blur-2xl border-border/60 shadow-2xl rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Delete Investment</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this investment? This action cannot be undone and all associated data will be permanently removed.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <DialogClose render={<Button variant="outline" disabled={isDeleting} className="rounded-xl border-border/60" />}>
                    Cancel
                  </DialogClose>
                  <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="rounded-xl">
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 pr-24">
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
