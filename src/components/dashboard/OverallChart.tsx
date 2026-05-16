"use client";

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      return (
        <div className="bg-card/80 backdrop-blur-xl border border-border/80 p-4 rounded-xl shadow-2xl space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
          <div className="space-y-1.5 pt-1 border-t border-border/40">
            <div className="flex justify-between items-center gap-8">
              <span className="text-[11px] text-muted-foreground font-medium">Total Invested</span>
              <span className="text-sm font-mono font-bold text-foreground">₹{Number(payload[0].value).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-center gap-8">
              <span className="text-[11px] text-success font-medium">Expected Return</span>
              <span className="text-sm font-mono font-bold text-success">₹{Number(payload[1].value).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-center gap-8 pt-1 border-t border-border/20">
              <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Projected ROI</span>
              <span className="text-xs font-mono font-bold text-primary">
                +{(((payload[1].value - payload[0].value) / payload[0].value) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1 border-border/60 bg-card/60 dark:bg-card/40 backdrop-blur-2xl shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-foreground text-sm font-bold tracking-wide uppercase">Capital Flow & Projections</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Cumulative investments vs expected maturity valuations</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="investedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="returnGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }} />
              <Area 
                type="monotone" 
                dataKey="totalInvested" 
                name="Invested Capital" 
                stroke="#64748b" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#investedGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="totalReturn" 
                name="Expected Return Valuation" 
                stroke="var(--success)" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#returnGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
