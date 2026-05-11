import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format, differenceInMonths } from "date-fns";

export function InvestmentCard({ investment }: { investment: any }) {
  const monthsElapsed = Math.min(Math.max(differenceInMonths(new Date(), new Date(investment.investingDate)), 0), 12);
  const isMatured = new Date() >= new Date(investment.returnDate);

  let statusBadge = null;
  if (investment.isPaid) {
    statusBadge = <Badge className="bg-success/10 text-success hover:bg-success/20 border border-success/20 rounded px-1.5 py-0 font-mono text-[10px]">PAID</Badge>;
  } else if (isMatured) {
    statusBadge = <Badge className="bg-foreground/10 text-foreground hover:bg-foreground/20 border border-foreground/20 rounded px-1.5 py-0 font-mono text-[10px]">MATURED</Badge>;
  } else {
    statusBadge = <Badge className="bg-warning/10 text-warning hover:bg-warning/20 border border-warning/20 rounded px-1.5 py-0 font-mono text-[10px]">ACTIVE</Badge>;
  }

  return (
    <Link href={`/investments/${investment._id}`}>
      <Card className="border-border bg-card hover:bg-muted/30 transition-colors cursor-pointer shadow-sm">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-foreground text-lg leading-tight">{investment.investorName}</h3>
              <p className="text-[11px] text-muted-foreground mt-1 font-mono tracking-wide uppercase">
                Returns: {format(new Date(investment.returnDate), "dd MMM yyyy")}
              </p>
            </div>
            {statusBadge}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-medium">Invested</p>
              <p className="font-medium text-foreground font-mono text-sm">₹{investment.amount.toLocaleString("en-IN")}</p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-medium">Expected</p>
              <p className="font-medium text-foreground font-mono text-sm">₹{investment.returnAmount.toLocaleString("en-IN")}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
              <span>Progress</span>
              <span className="font-mono">{monthsElapsed} / 12 M</span>
            </div>
            <div className="w-full bg-border rounded-full h-1 overflow-hidden">
              <div
                className="bg-foreground h-full rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${(monthsElapsed / 12) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
