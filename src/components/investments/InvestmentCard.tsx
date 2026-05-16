import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format, differenceInMonths } from "date-fns";

export function InvestmentCard({ investment }: { investment: any }) {
  const monthsElapsed = Math.min(Math.max(differenceInMonths(new Date(), new Date(investment.investingDate)), 0), 12);
  const isMatured = new Date() >= new Date(investment.returnDate);
  const netProfit = investment.returnAmount - investment.amount;
  const roi = ((netProfit / investment.amount) * 100).toFixed(1);

  let statusBadge = null;
  if (investment.isPaid) {
    statusBadge = <Badge className="bg-success/10 text-success hover:bg-success/20 border border-success/20 rounded px-2 py-0.5 font-mono text-[10px] font-bold">PAID</Badge>;
  } else if (isMatured) {
    statusBadge = <Badge className="bg-foreground/10 text-foreground hover:bg-foreground/20 border border-foreground/20 rounded px-2 py-0.5 font-mono text-[10px] font-bold">MATURED</Badge>;
  } else {
    statusBadge = <Badge className="bg-warning/10 text-warning hover:bg-warning/20 border border-warning/20 rounded px-2 py-0.5 font-mono text-[10px] font-bold">ACTIVE</Badge>;
  }

  return (
    <Link href={`/investments/${investment._id}`}>
      <Card className="border-border/60 bg-card/60 dark:bg-card/40 backdrop-blur-2xl hover:border-primary/40 transition-all duration-300 cursor-pointer shadow-2xl hover:shadow-primary/5">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-foreground text-lg leading-tight tracking-tight">{investment.investorName}</h3>
              <p className="text-[11px] text-muted-foreground mt-1 font-mono tracking-wide uppercase">
                Maturity: {format(new Date(investment.returnDate), "dd MMM yyyy")}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              {statusBadge}
              <span className="text-success bg-success/10 px-1.5 py-0.5 rounded font-mono font-bold text-[10px]">+{roi}% ROI</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-background/60 rounded-xl p-2.5 border border-border/40 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-semibold">Invested</p>
              <p className="font-bold text-foreground font-mono text-xs">₹{investment.amount.toLocaleString("en-IN")}</p>
            </div>
            <div className="bg-background/60 rounded-xl p-2.5 border border-border/40 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-semibold">Expected</p>
              <p className="font-bold text-foreground font-mono text-xs">₹{investment.returnAmount.toLocaleString("en-IN")}</p>
            </div>
            <div className="bg-success/5 rounded-xl p-2.5 border border-success/20 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-widest text-success mb-1 font-semibold">Net Profit</p>
              <p className="font-bold text-success font-mono text-xs">+₹{netProfit.toLocaleString("en-IN")}</p>
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-border/40">
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              <span>Maturity Progress</span>
              <span className="font-mono text-primary">{monthsElapsed} / 12 M</span>
            </div>
            <div className="w-full bg-background/80 border border-border/40 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500 ease-in-out shadow-sm"
                style={{ width: `${(monthsElapsed / 12) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
