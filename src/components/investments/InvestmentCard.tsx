import Link from "next/link";
import { format, differenceInMonths } from "date-fns";
import { ArrowUpRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface InvestmentCardProps {
  investment: {
    _id: string;
    investorName: string;
    amount: number;
    returnAmount: number;
    mobileNo: string;
    aadharNo?: string;
    investingDate: string | Date;
    returnDate: string | Date;
    isPaid: boolean;
    roi?: number;
  };
}

export function InvestmentCard({ investment }: InvestmentCardProps) {
  const monthsElapsed = Math.min(
    Math.max(differenceInMonths(new Date(), new Date(investment.investingDate)), 0),
    12
  );
  const isMatured = new Date() >= new Date(investment.returnDate);
  const netProfit = investment.returnAmount - investment.amount;
  const roi = investment.amount > 0 ? ((netProfit / investment.amount) * 100).toFixed(0) : "0";
  const progressPercent = Math.min(Math.round((monthsElapsed / 12) * 100), 100);
  const initial = investment.investorName?.charAt(0)?.toUpperCase() || "I";

  return (
    <Link href={`/investments/${investment._id}`} className="block group">
      <div className="p-4 sm:p-5 rounded-2xl bg-card text-card-foreground border border-border hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between h-full">
        <div className="space-y-4">
          {/* Header Row with Avatar & Status */}
          <div className="flex items-start justify-between gap-2.5 sm:gap-3 pb-3 border-b border-border/70">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="h-8.5 w-8.5 sm:h-9 sm:w-9 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center font-bold text-xs tracking-tight shrink-0 shadow-xs">
                {initial}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm text-foreground tracking-tight group-hover:text-primary transition-colors truncate">
                    {investment.investorName}
                  </h3>
                  <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5 truncate">
                  {investment.mobileNo}
                  {investment.aadharNo ? ` • ●●●● ${investment.aadharNo.slice(-4)}` : ""}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              {investment.isPaid ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 sm:px-2.5 py-0.5 rounded-full whitespace-nowrap">
                  <CheckCircle2 className="h-3 w-3" /> Settled
                </span>
              ) : isMatured ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 sm:px-2.5 py-0.5 rounded-full whitespace-nowrap">
                  <AlertCircle className="h-3 w-3" /> Matured
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 sm:px-2.5 py-0.5 rounded-full whitespace-nowrap">
                  <Clock className="h-3 w-3" /> Active
                </span>
              )}
            </div>
          </div>

          {/* Capital Amounts Grid */}
          <div className="grid grid-cols-2 gap-3 py-1 font-mono tabular-nums">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Principal
              </span>
              <p className="text-sm font-bold text-foreground">
                ₹{investment.amount.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="space-y-0.5 text-right">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Payout
              </span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                ₹{investment.returnAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Progress Timeline Tracker */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono">
              <span>{monthsElapsed} / 12 Months</span>
              <span className="text-orange-600 dark:text-orange-400 font-semibold font-sans">+{roi}% ROI</span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  investment.isPaid
                    ? "bg-emerald-500"
                    : isMatured
                    ? "bg-amber-500"
                    : "bg-gradient-to-r from-orange-500 to-amber-500"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer with Dates */}
        <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
          <span>Start: {format(new Date(investment.investingDate), "dd MMM yy")}</span>
          <span>Due: {format(new Date(investment.returnDate), "dd MMM yy")}</span>
        </div>
      </div>
    </Link>
  );
}
