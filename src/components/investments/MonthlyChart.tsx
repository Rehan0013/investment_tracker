"use client";

import { useState, useMemo } from "react";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MonthlySnapshot } from "@/lib/utils";
import { format } from "date-fns";
import { Sparkles, CheckCircle2, Clock } from "lucide-react";

interface MonthlyChartProps {
  data: MonthlySnapshot[];
  investingDate?: string | Date;
}

export function MonthlyChart({ data, investingDate }: MonthlyChartProps) {
  const [viewMode, setViewMode] = useState<"accrued" | "all">("accrued");

  const now = new Date();

  // Filter: strictly only months whose date has already crossed / elapsed
  const { filteredData, crossedCount } = useMemo(() => {
    if (!data || data.length === 0) return { filteredData: [], crossedCount: 0 };

    const crossed = data.filter((d) => new Date(d.date) <= now);
    const count = crossed.length;

    if (viewMode === "accrued") {
      // If investment was just booked and no full month has crossed yet, show month 1 as current active period
      return {
        filteredData: crossed.length > 0 ? crossed : data.slice(0, 1),
        crossedCount: count,
      };
    }

    return { filteredData: data, crossedCount: count };
  }, [data, viewMode]);

  if (!data || data.length === 0) return null;

  const chartData = filteredData.map((d) => {
    const isCrossed = new Date(d.date) <= now;
    return {
      monthStr: format(new Date(d.date), "MMM yy"),
      opening: d.openingBalance,
      profit: d.interest,
      closing: d.closingBalance,
      isCrossed,
      percentage: d.openingBalance > 0 ? ((d.interest / d.openingBalance) * 100).toFixed(1) : "0.0",
    };
  });

  const totalAccruedProfit = filteredData.reduce((acc, curr) => acc + curr.interest, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-popover text-popover-foreground border border-border px-3.5 py-3 rounded-xl shadow-xl text-xs font-mono space-y-1.5 min-w-[200px]">
          <div className="flex items-center justify-between border-b border-border/60 pb-1 font-sans">
            <span className="font-semibold text-foreground">{label}</span>
            <span
              className={`text-[10px] px-2 py-0.2 rounded-full font-medium ${
                item.isCrossed
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
              }`}
            >
              {item.isCrossed ? "Accrued" : "Projected"}
            </span>
          </div>

          <div className="flex justify-between items-center gap-6 tabular-nums">
            <span className="text-muted-foreground font-sans">Opening:</span>
            <span className="text-foreground">₹{item.opening.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between items-center gap-6 tabular-nums">
            <span className="text-muted-foreground font-sans">Monthly Profit:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              +₹{item.profit.toLocaleString("en-IN")} ({item.percentage}%)
            </span>
          </div>

          <div className="flex justify-between items-center gap-6 pt-1 border-t border-border/40 tabular-nums">
            <span className="text-muted-foreground font-sans">Cumulative Value:</span>
            <span className="font-bold text-foreground">₹{item.closing.toLocaleString("en-IN")}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-4 sm:p-5 border-border bg-card text-card-foreground shadow-sm transition-colors">
      <CardHeader className="p-0 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-bold text-foreground">
                Monthly Profit & Accrual Distribution
              </CardTitle>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {crossedCount} of 12 Months Elapsed
              </span>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Showing profit distribution for months elapsed up to current date (Accrued:{" "}
              <strong className="text-emerald-600 dark:text-emerald-400">
                +₹{totalAccruedProfit.toLocaleString("en-IN")}
              </strong>
              )
            </CardDescription>
          </div>

          {/* Toggle: Accrued (Current) vs Full Schedule */}
          <div className="w-full sm:w-auto grid grid-cols-2 sm:flex items-center bg-secondary p-1 rounded-full border border-border text-xs">
            <button
              onClick={() => setViewMode("accrued")}
              className={`text-center px-2 sm:px-3 py-1 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap text-[11px] sm:text-xs ${
                viewMode === "accrued"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Accrued ({crossedCount} Mo)
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={`text-center px-2 sm:px-3 py-1 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap text-[11px] sm:text-xs ${
                viewMode === "all"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Full (12 Mo)
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="h-[270px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 15, right: 10, left: -16, bottom: 0 }}
              barSize={28}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-border/60"
                vertical={false}
              />
              <XAxis
                dataKey="monthStr"
                stroke="currentColor"
                className="text-muted-foreground text-[11px]"
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              <YAxis
                stroke="currentColor"
                className="text-muted-foreground text-[11px]"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  value >= 100000
                    ? `₹${(value / 100000).toFixed(1)}L`
                    : `₹${Math.round(value / 1000)}k`
                }
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "currentColor", className: "text-muted/30" }}
              />
              {/* Principal Base Layer */}
              <Bar
                dataKey="opening"
                stackId="accrual"
                fill="currentColor"
                className="text-muted-foreground/20"
              />
              {/* Accrued Profit Top Layer */}
              <Bar
                dataKey="profit"
                stackId="accrual"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend strip */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/80 mt-2">
          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-muted-foreground/30" />
              <span>Base Principal Valuation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 shadow-xs" />
              <span className="font-medium text-foreground">Accrued Return</span>
            </div>
          </div>

          <span className="text-[11px] font-mono">
            {viewMode === "accrued"
              ? "Displaying only passed months"
              : "Displaying full contract schedule"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
