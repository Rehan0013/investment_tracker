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
      <Card className="bg-card border-border shadow-sm mt-4">
        <CardContent className="p-6 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <InvestmentEditSheet investment={investment} />
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger render={
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 text-destructive border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors rounded-lg shadow-sm"
                />
              }>
                <Trash2 className="h-4 w-4" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete Investment</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this investment? This action cannot be undone and all associated data will be permanently removed.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <DialogClose render={<Button variant="outline" disabled={isDeleting} />}>
                    Cancel
                  </DialogClose>
                  <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 pr-24">
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Investor Name</p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{investment.investorName}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Mobile Number</p>
                <p className="font-semibold text-sm text-foreground">{investment.mobileNo}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Amount</p>
                <p className="font-semibold text-sm text-foreground font-mono">₹{investment.amount.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Status</p>
                <Badge className={`px-2.5 py-0.5 text-xs font-medium rounded-full shadow-sm ${isPaid ? "text-success font-bold bg-success/10" : "text-[#f59e0b] font-bold bg-[#f59e0b]/10"}`}>
                  {isPaid ? "Paid" : "Active"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Invested On</p>
            <p className="font-semibold text-sm text-foreground">{format(new Date(investment.investingDate), "dd MMM yyyy")}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Returns On</p>
            <p className="font-semibold text-sm text-foreground">{format(new Date(investment.returnDate), "dd MMM yyyy")}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border col-span-2 shadow-sm">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Aadhar Number</p>
              <p className="font-semibold text-sm font-mono tracking-widest text-foreground">{investment.aadharNo.replace(/(\d{4})\d{4}(\d{4})/, '$1 ●●●● $2')}</p>
            </div>
            <div className="text-right border-l border-border pl-4">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Expected Return</p>
              <p className="font-semibold text-sm text-success font-mono">₹{investment.returnAmount.toLocaleString("en-IN")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-5 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-muted-foreground">{progress.monthsElapsed} of 12 months completed</span>
            <span className="font-bold text-primary">{progress.percentageComplete}%</span>
          </div>
          <div className="w-full bg-background rounded-full h-3 border border-border overflow-hidden">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-1000 ease-in-out"
              style={{ width: `${progress.percentageComplete}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border mt-4">
            <div>
              <p className="text-xs text-muted-foreground">Current Value</p>
              <p className="font-bold text-xl text-foreground">₹{progress.currentValue.toLocaleString("en-IN")}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Profit So Far</p>
              <p className="font-bold text-xl text-success">+₹{progress.profitSoFar.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <MonthlyChart data={visibleMonthlyData} />

      {/* Monthly Table */}
      <Card className="bg-card border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-12 text-muted-foreground">M</TableHead>
                <TableHead className="text-muted-foreground">Opening</TableHead>
                <TableHead className="text-muted-foreground">Interest</TableHead>
                <TableHead className="text-right text-muted-foreground">Closing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleMonthlyData.map((d, i) => (
                <TableRow
                  key={d.month}
                  className={`border-border transition-colors hover:bg-muted/20 ${i + 1 === progress.monthsElapsed && !isPaid ? 'bg-muted/30' : ''}`}
                >
                  <TableCell className="font-medium text-xs text-muted-foreground">{d.month}</TableCell>
                  <TableCell className="text-sm text-foreground font-mono">₹{Math.round(d.openingBalance).toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-sm text-success font-mono">+₹{Math.round(d.interest).toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-sm text-right font-medium text-foreground font-mono">₹{Math.round(d.closingBalance).toLocaleString("en-IN")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Action Section */}
      {progress.monthsElapsed === 12 && (
        <div className="fixed bottom-16 left-0 w-full p-4 bg-background/80 backdrop-blur-md border-t border-border sm:relative sm:bottom-0 sm:bg-transparent sm:border-0 sm:p-0 z-40">
          <Button
            onClick={handleTogglePayment}
            disabled={isPending}
            variant={isPaid ? "outline" : "default"}
            className={`w-full h-14 text-lg font-bold shadow-lg transition-all ${!isPaid ? 'bg-success hover:bg-success/90 text-white shadow-success/25' : 'text-foreground'}`}
          >
            {isPending ? "Updating..." : (isPaid ? "Revert Transfer" : "Money Transferred ✓")}
          </Button>
        </div>
      )}
    </div>
  );
}
