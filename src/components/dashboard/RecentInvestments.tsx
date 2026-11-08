"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface InvestmentItem {
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
}

export function RecentInvestments({ investments }: { investments: InvestmentItem[] }) {
  const router = useRouter();

  if (!investments || investments.length === 0) {
    return (
      <Card className="p-5">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-sm font-semibold">Recent Ledger Entries</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Latest investment positions recorded in this portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 py-8 text-center text-xs text-muted-foreground">
          No investment records found. Add your first investment entry.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-5 flex flex-col justify-between">
      <div>
        <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">
              Recent Ledger Entries
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Latest portfolio commitments and settlement status
            </CardDescription>
          </div>
          <Link
            href="/investments"
            className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            Full Portfolio <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-muted-foreground py-2 pl-0">
                    Investor
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground py-2 text-right">
                    Principal
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground py-2 text-right">
                    Maturity Payout
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground py-2 text-right">
                    Net Return
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground py-2 text-center">
                    Maturity Date
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground py-2 pr-0 text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((inv) => {
                  const profit = inv.returnAmount - inv.amount;
                  const roiPercent = inv.amount > 0 ? ((profit / inv.amount) * 100).toFixed(0) : "0";

                  return (
                    <TableRow
                      key={inv._id}
                      className="border-b border-border/60 hover:bg-muted/40 cursor-pointer transition-colors"
                      onClick={() => router.push(`/investments/${inv._id}`)}
                    >
                      <TableCell className="py-3 pl-0">
                        <div className="font-medium text-xs text-foreground">
                          {inv.investorName}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {inv.mobileNo}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-right font-mono text-xs tabular-nums text-foreground">
                        ₹{inv.amount.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="py-3 text-right font-mono text-xs tabular-nums font-semibold text-foreground">
                        ₹{inv.returnAmount.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="py-3 text-right font-mono text-xs tabular-nums text-emerald-600 dark:text-emerald-400">
                        +₹{profit.toLocaleString("en-IN")}
                        <span className="text-[10px] text-muted-foreground ml-1">({roiPercent}%)</span>
                      </TableCell>
                      <TableCell className="py-3 text-center font-mono text-xs text-muted-foreground">
                        {format(new Date(inv.returnDate), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell className="py-3 pr-0 text-right">
                        {inv.isPaid ? (
                          <Badge variant="success" className="text-[10px] font-medium">
                            Settled
                          </Badge>
                        ) : (
                          <Badge variant="warning" className="text-[10px] font-medium">
                            Active
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-border/60">
            {investments.map((inv) => {
              const profit = inv.returnAmount - inv.amount;
              const roiPercent = inv.amount > 0 ? ((profit / inv.amount) * 100).toFixed(0) : "0";

              return (
                <div
                  key={inv._id}
                  className="py-3 flex items-center justify-between gap-3 active:bg-muted/40 cursor-pointer"
                  onClick={() => router.push(`/investments/${inv._id}`)}
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-foreground">{inv.investorName}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      Maturity: {format(new Date(inv.returnDate), "dd MMM yyyy")}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xs font-semibold font-mono tabular-nums text-foreground">
                      ₹{inv.returnAmount.toLocaleString("en-IN")}
                    </p>
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                        +{roiPercent}%
                      </span>
                      {inv.isPaid ? (
                        <Badge variant="success" className="text-[9px] px-1.5 py-0">
                          Settled
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="text-[9px] px-1.5 py-0">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
