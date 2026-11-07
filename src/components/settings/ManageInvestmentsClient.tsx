"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ChevronLeft, Search, Trash2, Landmark } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { InvestmentEditSheet } from "@/components/investments/InvestmentEditSheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { deleteInvestment } from "@/actions/investment.actions";

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
      inv.mobileNo.includes(search) ||
      (inv.aadharNo && inv.aadharNo.includes(search));
    return matchesSearch;
  });

  const handleDelete = () => {
    if (!deletingId) return;

    startDeleteTransition(async () => {
      const res = await deleteInvestment(deletingId);
      if (res.success) {
        toast.success("Investment record deleted");
        setIsDeleteDialogOpen(false);
        setDeletingId(null);
        router.refresh();
      } else {
        toast.error("Failed to delete investment record");
      }
    });
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center gap-2">
        <Link href="/settings">
          <Button variant="ghost" size="sm" className="h-8 gap-1 pl-1 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
            <span className="text-xs font-medium">Settings</span>
          </Button>
        </Link>
      </div>

      <div className="border-b border-border/60 pb-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Manage Investment Records
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Inspect, update parameters, or permanently remove investor portfolio entries.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
        <Input
          placeholder="Filter by name, mobile, or Aadhaar..."
          className="pl-9 h-9 text-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Investments List */}
      <div className="grid gap-3">
        {filtered.length > 0 ? (
          filtered.map((inv) => {
            const isMatured = new Date() >= new Date(inv.returnDate);
            const netProfit = inv.returnAmount - inv.amount;
            const roi = inv.amount > 0 ? ((netProfit / inv.amount) * 100).toFixed(0) : "0";

            return (
              <Card key={inv._id} className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">
                        {inv.investorName}
                      </span>
                      {inv.isPaid ? (
                        <Badge variant="success" className="text-[10px]">
                          Settled
                        </Badge>
                      ) : isMatured ? (
                        <Badge variant="destructive" className="text-[10px]">
                          Matured
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="text-[10px]">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono">
                      <span>{inv.mobileNo}</span>
                      <span>•</span>
                      <span>Principal: ₹{inv.amount.toLocaleString("en-IN")}</span>
                      <span>•</span>
                      <span>Maturity: ₹{inv.returnAmount.toLocaleString("en-IN")} (+{roi}%)</span>
                      <span>•</span>
                      <span>Date: {format(new Date(inv.investingDate), "dd MMM yyyy")}</span>
                    </div>

                    {(inv.accountNo || inv.bankName) && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 w-fit mt-1">
                        <Landmark className="w-3 h-3 shrink-0" />
                        <span>
                          {inv.bankName || "Bank"}: A/C ••••{inv.accountNo ? inv.accountNo.slice(-4) : "—"}{" "}
                          {inv.ifscCode ? `(${inv.ifscCode})` : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <InvestmentEditSheet investment={inv} onSuccess={handleRefresh} />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeletingId(inv._id);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-xs h-8 gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="py-16 text-center border border-dashed border-border rounded-xl bg-card">
            <p className="text-xs text-muted-foreground">No investment records match your filter.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border p-6">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-foreground">
              Delete Investment Contract
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1.5">
              Are you sure you want to permanently delete this investment contract? This action will remove the record and cannot be reversed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <DialogClose render={
              <Button
                variant="outline"
                size="sm"
                disabled={isDeleting}
                onClick={() => setDeletingId(null)}
                className="text-xs"
              />
            }>
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
