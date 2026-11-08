"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";

interface InvestmentItem {
  _id: string;
  investorName: string;
  amount: number;
  returnAmount: number;
  investingDate: string | Date;
  returnDate: string | Date;
  isPaid: boolean;
}

interface RecentTransactionsCardProps {
  investments?: InvestmentItem[];
}

export function RecentTransactionsCard({ investments }: RecentTransactionsCardProps) {
  const hasRealData = investments && investments.length > 0;

  // Fallback demo items if database has no records yet
  const fallbackItems = [
    {
      id: "tx-1",
      title: "Kavita Mehta",
      subtitle: "20 Jan, 02:00 PM",
      amount: "+₹75,000",
      status: "Accruing",
      initials: "KM",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    },
    {
      id: "tx-2",
      title: "Alexander Wright",
      subtitle: "18 Jan, 11:30 AM",
      amount: "+₹45,000",
      status: "Settled",
      initials: "AW",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    },
    {
      id: "tx-3",
      title: "Marcus Vance",
      subtitle: "15 Jan, 04:15 PM",
      amount: "+₹30,000",
      status: "Accruing",
      initials: "MV",
      badgeColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20",
    },
  ];

  return (
    <div className="bg-card dark:bg-[#101116] border border-border dark:border-white/[0.08] rounded-3xl p-4 sm:p-6 shadow-sm relative overflow-hidden flex flex-col justify-between transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
            Recent Ledger Activity
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Latest recorded investor contracts and payout status
          </p>
        </div>

        <Link
          href="/investments"
          className="text-xs font-semibold text-[#8b5cf6] hover:text-[#7c3aed] flex items-center gap-0.5 shrink-0"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2]" />
        </Link>
      </div>

      {/* Transaction List */}
      <div className="space-y-2.5">
        {hasRealData
          ? investments.slice(0, 4).map((inv, idx) => {
              const profit = inv.returnAmount - inv.amount;
              const formattedDate = inv.investingDate
                ? format(new Date(inv.investingDate), "dd MMM, hh:mm a")
                : "Recent";
              const initials = inv.investorName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "IN";

              return (
                <Link
                  key={inv._id}
                  href={`/investments/${inv._id}`}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-secondary/40 dark:bg-white/[0.03] hover:bg-secondary/80 dark:hover:bg-white/[0.06] border border-border/70 dark:border-white/[0.06] hover:border-primary/40 dark:hover:border-white/15 transition-all group"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    {/* Rounded Avatar Chip */}
                    <div
                      className={`w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                        idx === 0
                          ? "bg-gradient-to-tr from-[#a855f7] to-[#8b5cf6] text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]"
                          : idx === 1
                          ? "bg-gradient-to-tr from-emerald-600 to-teal-400 text-white"
                          : "bg-secondary dark:bg-white/[0.06] text-foreground border border-border dark:border-white/10"
                      }`}
                    >
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate max-w-[130px] sm:max-w-xs">
                        {inv.investorName}
                      </h4>
                      <p className="text-[11px] text-muted-foreground font-mono mt-0.5 truncate">
                        {formattedDate}
                      </p>
                    </div>
                  </div>

                  {/* Return Amount in Emerald */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                      +₹{profit > 0 ? profit.toLocaleString("en-IN") : inv.amount.toLocaleString("en-IN")}
                    </span>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {inv.isPaid ? "Settled" : "Accruing"}
                    </p>
                  </div>
                </Link>
              );
            })
          : fallbackItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-secondary/70 hover:bg-muted border border-border/60 transition-all"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div
                    className={`w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${item.badgeColor}`}
                  >
                    {item.initials}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-foreground truncate max-w-[130px] sm:max-w-xs">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                    {item.amount}
                  </span>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {item.status}
                  </p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
