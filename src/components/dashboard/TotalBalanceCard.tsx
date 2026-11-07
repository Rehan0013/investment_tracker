"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp, ArrowUpRight } from "lucide-react";

interface MonthlyData {
  month: string;
  totalInvested: number;
  totalReturn: number;
}

interface TotalBalanceCardProps {
  totalBalance: number;
  totalInvested?: number;
  growthPercent?: string | number;
  monthlyData: MonthlyData[];
  averageAnnualRate?: number;
}

export function TotalBalanceCard({
  totalBalance,
  totalInvested = 250000,
  growthPercent = "60.0",
  monthlyData,
  averageAnnualRate = 150000,
}: TotalBalanceCardProps) {
  const [activeFilter, setActiveFilter] = useState<"1 year" | "6 month" | "3 month" | "1 month">("1 year");
  const filters: Array<"1 year" | "6 month" | "3 month" | "1 month"> = [
    "1 year",
    "6 month",
    "3 month",
    "1 month",
  ];

  // Base dataset: use real monthly data or fallback 12-month sample
  const baseData = useMemo(() => {
    if (monthlyData && monthlyData.length >= 4) {
      return monthlyData.map((d) => ({
        month: d.month,
        invested: d.totalInvested,
        returnAmount: d.totalReturn,
      }));
    }

    return [
      { month: "Mar", invested: 30000, returnAmount: 48000 },
      { month: "Apr", invested: 45000, returnAmount: 72000 },
      { month: "May", invested: 60000, returnAmount: 96000 },
      { month: "Jun", invested: 85000, returnAmount: 136000 },
      { month: "Jul", invested: 110000, returnAmount: 176000 },
      { month: "Aug", invested: 140000, returnAmount: 224000 },
      { month: "Sep", invested: 170000, returnAmount: 272000 },
      { month: "Oct", invested: 195000, returnAmount: 312000 },
      { month: "Nov", invested: 215000, returnAmount: 344000 },
      { month: "Dec", invested: 235000, returnAmount: 376000 },
      { month: "Jan", invested: 245000, returnAmount: 392000 },
      { month: "Feb", invested: 250000, returnAmount: 400000 },
    ];
  }, [monthlyData]);

  // Working filter logic: slice based on selected time window
  const filteredData = useMemo(() => {
    switch (activeFilter) {
      case "1 month":
        return baseData.slice(-2);
      case "3 month":
        return baseData.slice(-3);
      case "6 month":
        return baseData.slice(-6);
      case "1 year":
      default:
        return baseData.slice(-12);
    }
  }, [baseData, activeFilter]);

  // Dynamically compute totals for active filter window
  const activeReturnTotal = filteredData.length > 0 ? filteredData[filteredData.length - 1].returnAmount : totalBalance;
  const activeInvestedTotal = filteredData.length > 0 ? filteredData[filteredData.length - 1].invested : totalInvested;
  const activeProfit = activeReturnTotal - activeInvestedTotal;
  const activeRoi = activeInvestedTotal > 0 ? ((activeProfit / activeInvestedTotal) * 100).toFixed(1) : growthPercent;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const inv = Number(payload.find((p: any) => p.dataKey === "invested")?.value || 0);
      const ret = Number(payload.find((p: any) => p.dataKey === "returnAmount")?.value || 0);
      const diff = ret - inv;
      const pct = inv > 0 ? ((diff / inv) * 100).toFixed(1) : "0.0";

      return (
        <div className="bg-popover text-popover-foreground border border-border px-3.5 py-3 rounded-xl shadow-xl space-y-2 text-xs font-sans min-w-[200px]">
          <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
            <span className="font-semibold text-foreground">{label}</span>
            <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400">
              +{pct}% ROI
            </span>
          </div>

          <div className="space-y-1 font-mono tabular-nums">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                Invested Capital:
              </span>
              <span className="font-semibold text-foreground">
                ₹{inv.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Maturity Valuation:
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                ₹{ret.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 pt-1 border-t border-border/40 text-[11px]">
              <span className="text-muted-foreground">Projected Profit:</span>
              <span className="font-bold text-foreground">
                +₹{diff.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col justify-between transition-colors">
      {/* Top ambient warm glow for dark mode */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent pointer-events-none" />

      {/* Top Header: Title, Metric, Growth Badge, and Time Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Portfolio Valuation & Accrual
            </span>
            <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.2 rounded-full">
              {activeFilter}
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-3 mt-1.5">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums">
              ₹{activeReturnTotal.toLocaleString("en-IN")}
            </h2>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                ↑ +{activeRoi}% Net Yield
              </span>
              <span className="text-xs text-muted-foreground">
                (Principal: ₹{activeInvestedTotal.toLocaleString("en-IN")})
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Filter Pills */}
        <div className="flex items-center bg-secondary p-1 rounded-full border border-border self-start">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeFilter === f
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Dual Area Chart: Invested (Orange) + Return Valuation (Emerald) */}
      <div className="h-[230px] w-full relative -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 20, right: 16, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="warmOrangeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="emeraldReturnGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-border/60"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="currentColor"
              className="text-muted-foreground text-[11px]"
              tickLine={false}
              axisLine={false}
              dy={6}
            />
            <YAxis
              orientation="right"
              stroke="currentColor"
              className="text-muted-foreground text-[11px]"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) =>
                v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${Math.round(v / 1000)}k`
              }
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Area 1: Invested Capital (Orange) */}
            <Area
              type="monotone"
              dataKey="invested"
              name="Invested Capital"
              stroke="#f97316"
              strokeWidth={2.5}
              fill="url(#warmOrangeGradient)"
              activeDot={{
                r: 5,
                fill: "#ffffff",
                stroke: "#f97316",
                strokeWidth: 3,
              }}
            />

            {/* Area 2: Maturity Return Valuation (Emerald) */}
            <Area
              type="monotone"
              dataKey="returnAmount"
              name="Maturity Return"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#emeraldReturnGradient)"
              activeDot={{
                r: 5,
                fill: "#ffffff",
                stroke: "#10b981",
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Timeline Bar, Legend, and Stats */}
      <div className="pt-3 border-t border-border mt-2 space-y-3">
        {/* Horizontal Visual Timeline Tracker */}
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden flex">
          <div className="w-1/3 bg-muted h-full" />
          <div className="w-1/3 bg-emerald-500 h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <div className="w-1/3 bg-muted h-full" />
        </div>

        {/* Bottom Legend & Annual Stat */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="text-muted-foreground">
            Projected Profit:{" "}
            <span className="text-foreground font-semibold tabular-nums">
              +₹{activeProfit.toLocaleString("en-IN")}
            </span>{" "}
            <span className="text-[11px] text-muted-foreground">
              (Avg rate: ₹{averageAnnualRate.toLocaleString("en-IN")})
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-xs" />
              <span className="font-medium text-foreground">Invested Capital</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
              <span className="font-medium text-foreground">Maturity Return</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
