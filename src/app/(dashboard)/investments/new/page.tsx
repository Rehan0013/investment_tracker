import { InvestmentForm } from "@/components/investments/InvestmentForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export default function NewInvestmentPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/investments">
          <Button variant="ghost" size="sm" className="h-8 gap-1 pl-1 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
            <span className="text-xs font-medium">Portfolio Ledger</span>
          </Button>
        </Link>
      </div>

      <div className="border-b border-border/60 pb-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Record Investment Contract
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Register new private investor position, calculate returns, and generate contract schedule.
        </p>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading investment form...</div>}>
        <InvestmentForm />
      </Suspense>
    </div>
  );
}
