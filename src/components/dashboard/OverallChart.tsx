"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
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
  return (
    <Card className="col-span-1 border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-foreground text-sm font-semibold tracking-wide uppercase">Investments vs Returns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="month" 
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)", borderRadius: "8px" }}
                itemStyle={{ color: "var(--foreground)" }}
                formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, undefined]}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Bar dataKey="totalInvested" name="Invested" fill="var(--muted-foreground)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="totalReturn" name="Return (Expected)" fill="var(--foreground)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
