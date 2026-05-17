"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function RecentInvestments({ investments }: { investments: any[] }) {
  const router = useRouter();

  if (!investments || investments.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Recent Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-4">No investments found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-foreground text-sm font-semibold tracking-wide uppercase">Recent Investments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader className="bg-transparent border-b border-border/60">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-muted-foreground font-semibold text-xs tracking-wider uppercase">Investor Name</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs tracking-wider uppercase">Contact / ID</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs tracking-wider uppercase text-right">Invested</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs tracking-wider uppercase text-right">Expected</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs tracking-wider uppercase text-right">Net Profit</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs tracking-wider uppercase text-right">ROI</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs tracking-wider uppercase text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((inv) => {
                const netProfit = inv.returnAmount - inv.amount;
                const roi = ((netProfit / inv.amount) * 100).toFixed(1);
                return (
                  <TableRow key={inv._id} className="border-b border-border/40 hover:bg-muted/30 transition-colors group cursor-pointer" onClick={() => router.push(`/investments/${inv._id}`)}>
                    <TableCell className="font-medium py-3.5">
                      <span className="text-foreground font-semibold tracking-tight">{inv.investorName}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      <div>{inv.mobileNo}</div>
                      <div className="text-[10px] text-muted-foreground/70">{inv.aadharNo ? inv.aadharNo.replace(/(\d{4})\d{4}(\d{4})/, '$1 ●●●● $2') : 'N/A'}</div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground font-mono text-xs">₹{inv.amount.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right text-foreground font-mono text-xs font-semibold">₹{inv.returnAmount.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right text-success font-mono text-xs font-semibold">+₹{netProfit.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      <span className="text-success bg-success/10 px-1.5 py-0.5 rounded font-bold">+{roi}%</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className={inv.isPaid ? "bg-success/10 text-success hover:bg-success/20 border border-success/20 rounded px-2 py-0.5 font-mono text-[10px] font-bold" : "bg-warning/10 text-warning hover:bg-warning/20 border border-warning/20 rounded px-2 py-0.5 font-mono text-[10px] font-bold"}>
                        {inv.isPaid ? "PAID" : "ACTIVE"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col gap-3">
          {investments.map((inv) => {
            const netProfit = inv.returnAmount - inv.amount;
            const roi = ((netProfit / inv.amount) * 100).toFixed(1);
            return (
              <div 
                key={inv._id} 
                className="bg-card border border-border/60 rounded-xl p-4 flex flex-col gap-3 active:scale-[0.98] transition-transform cursor-pointer shadow-sm"
                onClick={() => router.push(`/investments/${inv._id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-foreground font-semibold tracking-tight">{inv.investorName}</h4>
                    <p className="text-muted-foreground font-mono text-[11px] mt-0.5">{inv.mobileNo}</p>
                  </div>
                  <Badge className={inv.isPaid ? "bg-success/10 text-success border border-success/20 rounded px-2 py-0.5 font-mono text-[10px] font-bold" : "bg-warning/10 text-warning border border-warning/20 rounded px-2 py-0.5 font-mono text-[10px] font-bold"}>
                    {inv.isPaid ? "PAID" : "ACTIVE"}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="bg-muted/30 p-2.5 rounded-lg border border-border/40">
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Invested</p>
                    <p className="font-mono text-sm font-medium">₹{inv.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-muted/30 p-2.5 rounded-lg border border-border/40">
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Expected</p>
                    <p className="font-mono text-sm font-semibold text-foreground">₹{inv.returnAmount.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1 pt-3 border-t border-border/40">
                  <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Profit</span>
                  <div className="flex items-center gap-2">
                    <span className="text-success font-mono text-sm font-bold">+₹{netProfit.toLocaleString('en-IN')}</span>
                    <span className="text-success bg-success/10 px-1.5 py-0.5 rounded font-bold font-mono text-xs">+{roi}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
