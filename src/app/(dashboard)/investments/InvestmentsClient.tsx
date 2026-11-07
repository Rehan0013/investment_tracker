"use client";

import { useState } from "react";
import { InvestmentCard } from "@/components/investments/InvestmentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, LayoutGrid, List, ArrowUpRight, X, Sparkles, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export function InvestmentsClient({ initialInvestments }: { initialInvestments: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Matured" | "Paid">("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const now = new Date();

  const counts = {
    All: initialInvestments.length,
    Active: initialInvestments.filter((i) => !i.isPaid && now < new Date(i.returnDate)).length,
    Matured: initialInvestments.filter((i) => !i.isPaid && now >= new Date(i.returnDate)).length,
    Paid: initialInvestments.filter((i) => i.isPaid).length,
  };

  const filtered = initialInvestments.filter((inv) => {
    const matchesSearch =
      inv.investorName.toLowerCase().includes(search.toLowerCase()) ||
      inv.mobileNo.includes(search) ||
      (inv.aadharNo && inv.aadharNo.includes(search));
    if (!matchesSearch) return false;

    const isMatured = now >= new Date(inv.returnDate);

    if (filter === "Paid") return inv.isPaid;
    if (filter === "Matured") return !inv.isPaid && isMatured;
    if (filter === "Active") return !inv.isPaid && !isMatured;
    return true;
  });

  const totalFilteredPrincipal = filtered.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalFilteredReturn = filtered.reduce((acc, curr) => acc + (curr.returnAmount || 0), 0);
  const totalFilteredProfit = totalFilteredReturn - totalFilteredPrincipal;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Portfolio Positions
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {initialInvestments.length} Total Registered Contracts • Currency: INR (₹)
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-secondary p-1 rounded-full border border-border shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-full text-xs transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-full text-xs transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Table View"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>

          <Link href="/investments/new" className="shrink-0">
            <button className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:brightness-110 text-white text-xs font-semibold shadow-lg shadow-orange-500/25 transition-all active:scale-95 cursor-pointer">
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Record Position</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-3.5 w-3.5 stroke-[1.8]" />
          <input
            placeholder="Search by name, phone, or Aadhaar..."
            className="w-full pl-9 pr-8 h-10 rounded-full bg-secondary border border-border focus:border-primary/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Dynamic Filter Badges */}
        <div className="flex items-center gap-1.5 bg-secondary p-1 rounded-full border border-border overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden text-xs">
          {(["All", "Active", "Matured", "Paid"] as const).map((tab) => {
            const count = counts[tab];
            const isSelected = filter === tab;
            const label = tab === "Paid" ? "Settled" : tab;

            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-primary/10 text-primary font-bold"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Filter Summary Strip */}
      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-secondary/70 border border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-orange-500" />
            <span>
              Showing <strong className="text-foreground">{filtered.length}</strong> of {initialInvestments.length} contracts
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono tabular-nums text-[11px]">
            <span>
              Principal: <strong className="text-foreground">₹{totalFilteredPrincipal.toLocaleString("en-IN")}</strong>
            </span>
            <span>
              Payout: <strong className="text-foreground">₹{totalFilteredReturn.toLocaleString("en-IN")}</strong>
            </span>
            <span>
              Yield: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">+₹{totalFilteredProfit.toLocaleString("en-IN")}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Content Area */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border rounded-2xl bg-card/60 space-y-2">
          <p className="text-sm font-semibold text-foreground">No investment contracts found</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {search ? `No records matching "${search}".` : "No positions in this status category."}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="px-4 py-1.5 rounded-full bg-secondary text-foreground hover:bg-muted text-xs font-medium border border-border mt-2 cursor-pointer"
            >
              Clear Search Filter
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((inv) => (
            <InvestmentCard key={inv._id} investment={inv} />
          ))}
        </div>
      ) : (
        <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-secondary/80 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold text-muted-foreground py-3">
                    Investor
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground py-3">
                    Contact / Aadhaar
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground py-3 text-right">
                    Principal
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground py-3 text-right">
                    Maturity Payout
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground py-3 text-right">
                    Net Profit
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground py-3 text-center">
                    Maturity Date
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground py-3 text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground py-3 text-right pr-4">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((inv) => {
                  const netGain = inv.returnAmount - inv.amount;
                  const roiPercent = inv.amount > 0 ? ((netGain / inv.amount) * 100).toFixed(0) : "0";
                  const isMatured = now >= new Date(inv.returnDate);

                  return (
                    <TableRow
                      key={inv._id}
                      className="border-b border-border/60 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/investments/${inv._id}`)}
                    >
                      <TableCell className="py-3.5 font-semibold text-xs text-foreground">
                        {inv.investorName}
                      </TableCell>
                      <TableCell className="py-3.5 text-xs font-mono text-muted-foreground">
                        <div>{inv.mobileNo}</div>
                        {inv.aadharNo && (
                          <div className="text-[10px] text-muted-foreground/80">
                            ●●●● {inv.aadharNo.slice(-4)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-3.5 text-right font-mono text-xs tabular-nums text-foreground">
                        ₹{inv.amount.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="py-3.5 text-right font-mono text-xs tabular-nums font-bold text-foreground">
                        ₹{inv.returnAmount.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="py-3.5 text-right font-mono text-xs tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold">
                        +₹{netGain.toLocaleString("en-IN")} ({roiPercent}%)
                      </TableCell>
                      <TableCell className="py-3.5 text-center text-xs font-mono text-muted-foreground">
                        {format(new Date(inv.returnDate), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        {inv.isPaid ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="h-3 w-3" /> Settled
                          </span>
                        ) : isMatured ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                            <AlertCircle className="h-3 w-3" /> Matured
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                            <Clock className="h-3 w-3" /> Active
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-3.5 text-right pr-4">
                        <span className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                          Detail <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
