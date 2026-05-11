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
    <div className="container p-4">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/investments">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <span className="font-medium text-muted-foreground text-sm">Back to Investments</span>
      </div>
      
      <InvestmentDetail investment={res.investment} />
    </div>
  );
}
