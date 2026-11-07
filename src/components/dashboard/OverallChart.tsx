"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ChartData {
  month: string;
  totalInvested: number;
  totalReturn: number;
}

interface OverallChartProps {
  data: ChartData[];
}

export function OverallChart({ data }: OverallChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const invested = Number(payload[0]?.value || 0);
      const expectedReturn = Number(payload[1]?.value || 0);
      const profit = expectedReturn - invested;
      const roi = invested > 0 ? ((profit / invested) * 100).toFixed(1) : "0.0";

      return (
        <div className="bg-popover border border-border px-3.5 py-3 rounded-lg shadow-sm space-y-2 text-xs">
          <p className="font-semibold text-foreground border-b border-border/60 pb-1.5">{label}</p>
          <div className="space-y-1 font-mono tabular-nums">
            <div className="flex justify-between items-center gap-6">
              <span className="text-muted-foreground">Invested Capital:</span>
              <span className="font-medium text-foreground">₹{invested.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-center gap-6">
              <span className="text-muted-foreground">Expected Maturity:</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                ₹{expectedReturn.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between items-center gap-6 pt-1 border-t border-border/40 text-[11px]">
              <span className="text-muted-foreground">Projected Yield:</span>
              <span className="font-semibold text-foreground">+{roi}% (+₹{profit.toLocaleString("en-IN")})</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-5">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">
              Capital Accrual & Return Schedule
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Cumulative portfolio capital allocation vs contractual maturity value
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[280px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" vertical={false} />
              <XAxis
                dataKey="month"
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
                tickFormatter={(value) => `₹${value >= 100000 ? `${(value / 100000).toFixed(1)}L` : `${value / 1000}k`}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ paddingBottom: "12px", fontSize: "11px" }}
              />
              <Area
                type="monotone"
                dataKey="totalInvested"
                name="Principal Capital"
                stroke="#64748b"
                strokeWidth={1.5}
                fill="#64748b"
                fillOpacity={0.06}
              />
              <Area
                type="monotone"
                dataKey="totalReturn"
                name="Maturity Valuation"
                stroke="#2563eb"
                strokeWidth={2}
                fill="#2563eb"
                fillOpacity={0.08}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
