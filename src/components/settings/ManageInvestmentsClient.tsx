"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format, differenceInMonths } from "date-fns";
import { ChevronLeft, Search, Trash2, Calendar, Phone, DollarSign } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { InvestmentEditSheet } from "@/components/investments/InvestmentEditSheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ManageInvestmentsClientProps {
  initialInvestments: any[];
}

export function ManageInvestmentsClient({ initialInvestments }: { initialInvestments: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isDeleting, startDeleteTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filtered = initialInvestments.filter((inv) => {
    const matchesSearch =
      inv.investorName.toLowerCase().includes(search.toLowerCase()) ||
      inv.mobileNo.includes(search);
    return matchesSearch;
  });

  const handleDelete = () => {
    if (!deletingId) return;

    startDeleteTransition(async () => {
      const res = await deleteInvestment(deletingId);
      if (res.success) {
        toast.success("Investment deleted successfully");
        setIsDeleteDialogOpen(false);
        setDeletingId(null);
        router.refresh();
      } else {
        toast.error("Failed to delete investment");
      }
    });
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header and Back Link */}
      <div className="flex items-center gap-2 mb-2">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <span className="font-medium text-muted-foreground text-sm">Back to Settings</span>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Manage Investments</h1>
        <p className="text-sm text-muted-foreground font-sans">Search, update, or remove client investment accounts.</p>
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search by investor name or mobile number..."
          className="pl-10 bg-card border-border focus-visible:ring-1 focus-visible:ring-ring text-foreground placeholder:text-muted-foreground h-11 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Investments List */}
      <div className="grid gap-4">
        {filtered.length > 0 ? (
          filtered.map((inv) => {
            const monthsElapsed = Math.min(
              Math.max(differenceInMonths(new Date(), new Date(inv.investingDate)), 0),
              12
            );
            const isMatured = new Date() >= new Date(inv.returnDate);
            const netProfit = inv.returnAmount - inv.amount;
            const roi = ((netProfit / inv.amount) * 100).toFixed(0);

            let statusBadge = null;
            if (inv.isPaid) {
              statusBadge = (
                <Badge className="bg-success/10 text-success border border-success/20 rounded px-2 py-0.5 font-mono text-[10px] font-bold">
                  PAID
                </Badge>
              );
            } else if (isMatured) {
              statusBadge = (
                <Badge className="bg-foreground/10 text-foreground border border-foreground/20 rounded px-2 py-0.5 font-mono text-[10px] font-bold">
                  MATURED
                </Badge>
              );
            } else {
              statusBadge = (
                <Badge className="bg-warning/10 text-warning border border-warning/20 rounded px-2 py-0.5 font-mono text-[10px] font-bold">
                  ACTIVE
                </Badge>
              );
            }

            return (
              <Card
                key={inv._id}
                className="border-border/60 bg-card/60 dark:bg-card/40 backdrop-blur-2xl shadow-xl hover:border-primary/20 transition-all duration-300"
              >
                <CardContent className="p-5 space-y-4">
                  {/* Top Row: Name and Status Badge */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-foreground text-lg leading-tight font-sans">
                        {inv.investorName}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-1 font-mono uppercase tracking-wider">
                        {inv.mobileNo}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusBadge}
                      <span className="text-success bg-success/10 px-1.5 py-0.5 rounded font-mono font-bold text-[10px]">
                        +{roi}% ROI
                      </span>
                    </div>
                  </div>

                  {/* Info Table Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold font-sans">
                        Invested Amount
                      </p>
                      <p className="font-bold text-foreground font-mono text-sm">
                        ₹{inv.amount.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold font-sans">
                        Expected Return
                      </p>
                      <p className="font-bold text-success font-mono text-sm">
                        ₹{inv.returnAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="space-y-0.5 col-span-2 sm:col-span-1">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold font-sans">
                        Investing Date
                      </p>
                      <p className="font-semibold text-foreground font-mono text-sm">
                        {format(new Date(inv.investingDate), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
                    {/* Reuse InvestmentEditSheet */}
                    <InvestmentEditSheet investment={inv} onSuccess={handleRefresh} />

                    {/* Delete Trigger Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDeletingId(inv._id);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="h-9 text-destructive border-border/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors rounded-lg gap-2"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="py-16 text-center flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-card/30">
            <p className="text-muted-foreground font-medium tracking-wide">No investments found.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card/90 backdrop-blur-2xl border-border/60 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-foreground">Delete Investment</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Are you sure you want to delete this investment? This action cannot be undone and all associated data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <DialogClose render={
              <Button
                variant="outline"
                disabled={isDeleting}
                onClick={() => setDeletingId(null)}
                className="rounded-xl border-border/60 text-foreground"
              />
            }>
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Separate helper or mock function to avoid module scope compilation issues
async function deleteInvestment(id: string) {
  const { deleteInvestment: apiDelete } = await import("@/actions/investment.actions");
  return apiDelete(id);
}
