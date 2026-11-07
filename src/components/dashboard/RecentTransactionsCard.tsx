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
      badgeColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col justify-between transition-colors">
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
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
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
                  className="flex items-center justify-between p-3 rounded-2xl bg-secondary/70 hover:bg-muted border border-border/60 hover:border-border transition-all group"
                >
                  <div className="flex items-center gap-3">
                    {/* Rounded Avatar Chip */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
                        idx === 0
                          ? "bg-gradient-to-tr from-emerald-600 to-teal-400 text-white"
                          : idx === 1
                          ? "bg-gradient-to-tr from-orange-500 to-amber-400 text-white"
                          : "bg-secondary text-foreground border border-border"
                      }`}
                    >
                      {initials}
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        {inv.investorName}
                      </h4>
                      <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        {formattedDate}
                      </p>
                    </div>
                  </div>

                  {/* Return Amount in Emerald */}
                  <div className="text-right">
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
                className="flex items-center justify-between p-3 rounded-2xl bg-secondary/70 hover:bg-muted border border-border/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${item.badgeColor}`}
                  >
                    {item.initials}
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-foreground">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-right">
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
