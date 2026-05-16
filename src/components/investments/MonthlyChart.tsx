"use client";

import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlySnapshot } from "@/lib/utils";
import { format } from "date-fns";

export function MonthlyChart({ data }: { data: MonthlySnapshot[] }) {
  if (!data || data.length === 0) return null;

  const chartData = data.map(d => ({
    monthStr: format(new Date(d.date), "MMM yy"),
    opening: d.openingBalance,
    profit: d.interest,
    closing: d.closingBalance,
    // Calculate percentage profit for this specific month
    percentage: ((d.interest / d.openingBalance) * 100).toFixed(2)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card/80 border border-border/80 p-4 rounded-xl shadow-2xl backdrop-blur-2xl">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center gap-10">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Opening</span>
              <span className="text-sm font-mono font-bold text-foreground">₹{data.opening.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-center gap-10">
              <span className="text-[10px] text-success uppercase font-semibold">Monthly Profit</span>
              <span className="text-sm font-mono font-bold text-success">+₹{data.profit.toLocaleString("en-IN")}</span>
            </div>
            <div className="pt-2 mt-1 border-t border-border/40 space-y-1">
              <div className="flex justify-between items-center gap-10">
                <span className="text-[10px] text-foreground uppercase font-bold">Closing</span>
                <span className="text-sm font-mono font-black text-foreground">₹{data.closing.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center gap-10">
                <span className="text-[10px] text-primary uppercase font-bold text-xs">Yield</span>
                <span className="text-sm font-mono font-black text-primary">{data.percentage}%</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-border/60 bg-card/60 dark:bg-card/40 backdrop-blur-2xl shadow-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold tracking-wide text-muted-foreground uppercase font-mono">Monthly Returns Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
              barSize={32}
            >
              <XAxis 
                dataKey="monthStr" 
                stroke="var(--muted-foreground)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={10}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'var(--muted)', opacity: 0.15, radius: 8 }}
              />
              <Bar 
                dataKey="opening" 
                stackId="a" 
                fill="#94a3b8" // Slate-400 for clear visibility
                className="opacity-40"
                radius={[0, 0, 0, 0]} 
              />
              <Bar 
                dataKey="profit" 
                stackId="a" 
                fill="var(--success)" 
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
