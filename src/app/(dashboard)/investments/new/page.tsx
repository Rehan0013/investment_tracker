import { InvestmentForm } from "@/components/investments/InvestmentForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewInvestmentPage() {
  return (
    <div className="container p-4 pt-6 md:pt-8 space-y-6 pb-20 sm:pb-8">
      <div className="flex items-center gap-2 z-10 relative">
        <Link href="/investments">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">New Investment</h1>
      </div>

      <InvestmentForm />
    </div>
  );
}
