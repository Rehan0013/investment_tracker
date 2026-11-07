import { getInvestmentById } from "@/actions/investment.actions";
import { InvestmentDetail } from "@/components/investments/InvestmentDetail";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function InvestmentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const res = await getInvestmentById(resolvedParams.id);

  if (!res.success || !res.investment) {
    return notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/investments">
          <Button variant="ghost" size="sm" className="h-8 gap-1 pl-1 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
            <span className="text-xs font-medium">Portfolio Ledger</span>
          </Button>
        </Link>
      </div>

      <InvestmentDetail investment={res.investment} />
    </div>
  );
}
