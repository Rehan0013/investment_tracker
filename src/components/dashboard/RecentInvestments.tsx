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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-transparent border-b border-border">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium text-xs tracking-wider uppercase">User Name</TableHead>
                <TableHead className="text-muted-foreground font-medium text-xs tracking-wider uppercase text-right">Invested</TableHead>
                <TableHead className="text-muted-foreground font-medium text-xs tracking-wider uppercase text-right">Expected</TableHead>
                <TableHead className="text-muted-foreground font-medium text-xs tracking-wider uppercase text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((inv) => (
                <TableRow key={inv._id} className="border-b border-border hover:bg-muted/30 transition-colors group cursor-pointer" onClick={() => router.push(`/investments/${inv._id}`)}>
                  <TableCell className="font-medium py-3">
                    <span className="text-foreground">{inv.investorName}</span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground font-mono text-xs">₹{inv.amount.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right text-foreground font-mono text-xs">₹{inv.returnAmount.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right">
                    <Badge className={inv.isPaid ? "bg-success/10 text-success hover:bg-success/20 border border-success/20 rounded px-1.5 py-0 font-mono text-[10px]" : "bg-warning/10 text-warning hover:bg-warning/20 border border-warning/20 rounded px-1.5 py-0 font-mono text-[10px]"}>
                      {inv.isPaid ? "PAID" : "ACTIVE"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
