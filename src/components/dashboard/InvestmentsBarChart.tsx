"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, Calendar } from "lucide-react";

interface BarData {
  month: string;
  value: number;
  isPeak?: boolean;
}

interface InvestmentsBarChartProps {
  totalExpected?: number;
  growthPercent?: string | number;
  data?: BarData[];
}

export function InvestmentsBarChart({
  totalExpected = 150000,
  growthPercent = "60.0",
  data,
}: InvestmentsBarChartProps) {
  const [sortMode, setSortMode] = useState<"chrono" | "value">("chrono");
  const [rangeMode, setRangeMode] = useState<"6m" | "3m">("6m");

  // Fallback specimen monthly columns if data is empty
  const rawItems: BarData[] = useMemo(() => {
    if (data && data.length >= 4) {
      return data;
    }
    return [
      { month: "Sep", value: 30000 },
      { month: "Oct", value: 45000 },
      { month: "Nov", value: 65000 },
      { month: "Dec", value: 85000 },
      { month: "Jan", value: 120000, isPeak: true },
      { month: "Feb", value: 95000 },
    ];
  }, [data]);

  // Working Filter & Sort logic
  const displayedBars = useMemo(() => {
    let items = rangeMode === "3m" ? rawItems.slice(-3) : rawItems.slice(-6);

    if (sortMode === "value") {
      items = [...items].sort((a, b) => b.value - a.value);
    }

    // Mark the max value as peak
    const maxVal = Math.max(...items.map((b) => b.value));
    return items.map((b) => ({
      ...b,
      isPeak: b.value === maxVal,
    }));
  }, [rawItems, sortMode, rangeMode]);

  const maxValue = Math.max(...displayedBars.map((b) => b.value), 1);
  const formattedMetric = `₹${totalExpected.toLocaleString("en-IN")}`;

  return (
    <div className="bg-card dark:bg-[#101116] border border-border dark:border-white/[0.08] rounded-3xl p-4 sm:p-6 shadow-sm relative overflow-hidden flex flex-col justify-between transition-colors">
      {/* Top Header: Title, Metric, Growth Badge, and Working Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Profit & Loss Accrual
            </span>
            <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
              Monthly Yield
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <h4 className="text-lg sm:text-xl font-bold tracking-tight text-foreground tabular-nums">
              {formattedMetric}
            </h4>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              ↑ +{growthPercent}%
            </span>
          </div>
        </div>

        {/* Right Working Controls: Sort & Range Pills */}
        <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
          <button
            onClick={() => setSortMode(sortMode === "chrono" ? "value" : "chrono")}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer active:scale-95 ${
              sortMode === "value"
                ? "bg-primary text-white border-primary shadow-xs font-semibold"
                : "bg-secondary dark:bg-white/[0.04] text-muted-foreground hover:text-foreground border-border dark:border-white/10"
            }`}
            title="Toggle: Chronological vs Highest Value"
          >
            <span>{sortMode === "value" ? "By Value" : "By Month"}</span>
            <ArrowUpDown className="w-3 h-3 stroke-[2]" />
          </button>

          <button
            onClick={() => setRangeMode(rangeMode === "6m" ? "3m" : "6m")}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-full bg-secondary dark:bg-white/[0.04] text-muted-foreground hover:text-foreground text-xs font-medium border border-border dark:border-white/10 transition-all cursor-pointer active:scale-95"
            title="Toggle range: 6 Months vs 3 Months"
          >
            <Calendar className="w-3 h-3 stroke-[2]" />
            <span>{rangeMode === "6m" ? "6 Months" : "3 Months"}</span>
          </button>
        </div>
      </div>

      {/* Bar Chart Columns */}
      <div className="h-[170px] w-full flex items-end justify-between gap-1.5 sm:gap-3 pt-8 px-1">
        {displayedBars.map((bar) => {
          const heightPercent = Math.max(Math.round((bar.value / maxValue) * 100), 14);
          const isPeak = bar.isPeak;

          return (
            <div key={bar.month} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              {/* Value Floating Tooltip Card above Peak Bar */}
              {isPeak ? (
                <div className="absolute -top-7 mb-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] text-white font-bold text-[10px] shadow-[0_0_15px_rgba(139,92,246,0.5)] z-10 whitespace-nowrap">
                  ₹{bar.value >= 100000 ? `${(bar.value / 100000).toFixed(1)}L` : bar.value >= 1000 ? `${Math.round(bar.value / 1000)}k` : bar.value}
                </div>
              ) : (
                <span className="text-[10px] text-muted-foreground/80 font-mono mb-1.5 group-hover:text-foreground transition-colors">
                  ₹{bar.value >= 100000 ? `${(bar.value / 100000).toFixed(1)}L` : bar.value >= 1000 ? `${Math.round(bar.value / 1000)}k` : bar.value}
                </span>
              )}

              {/* The Vertical Bar */}
              <div className="w-full max-w-[44px] relative flex items-end h-[100px]">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    isPeak
                      ? "bg-gradient-to-t from-[#8b5cf6] via-[#a855f7] to-[#c4b5fd] shadow-[0_0_20px_rgba(139,92,246,0.45)] ring-1 ring-white/30"
                      : "bg-[#8b5cf6]/50 hover:bg-[#8b5cf6]/80 border-t border-[#8b5cf6]"
                  }`}
                />
              </div>

              {/* Month Label below Bar */}
              <span className={`text-[11px] font-medium mt-2 transition-colors ${isPeak ? "text-primary font-bold" : "text-muted-foreground"}`}>
                {bar.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
