import { RoiSimulator } from "@/components/simulator/RoiSimulator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SimulatorPage() {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              ROI & Yield Simulator
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-[10px] font-semibold">
              Contract Modeler
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Simulate returns, evaluate 50% & 100% ROI tiers, and model capital distribution schedules.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium rounded-full cursor-pointer">
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
          <Link href="/investments/new">
            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:brightness-110 text-white text-xs font-semibold shadow-lg shadow-orange-500/25 transition-all active:scale-95 cursor-pointer">
              <span>Record Position</span>
            </button>
          </Link>
        </div>
      </div>

      {/* The Interactive Simulator */}
      <RoiSimulator />
    </div>
  );
}

