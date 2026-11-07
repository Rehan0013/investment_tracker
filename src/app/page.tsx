"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Sparkles,
  Layers,
  Percent,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";

const PRESET_AMOUNTS = [
  { label: "₹50K", value: 50000 },
  { label: "₹1 Lakh", value: 100000 },
  { label: "₹2.5 Lakh", value: 250000 },
  { label: "₹5 Lakh", value: 500000 },
  { label: "₹10 Lakh", value: 1000000 },
];

export default function Home() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "Investor";

  // Interactive Live Thing: Contract ROI Simulator
  const [calcAmount, setCalcAmount] = useState(100000);
  const [calcRoi, setCalcRoi] = useState(50);
  const [activeMonthHover, setActiveMonthHover] = useState<number | null>(null);

  const multiplier = calcRoi === 100 ? 2.0 : 1.5;
  const maturityPayout = calcAmount * multiplier;
  const netProfit = calcAmount * (calcRoi / 100);
  const monthlyAccrual = netProfit / 12;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
      {/* Top Navigation Bar */}
      <header className="border-b border-border/80 bg-background/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Eye className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-foreground leading-none">
                InvestTracker
              </span>
              <span className="text-[10px] text-muted-foreground font-mono leading-none mt-1">
                Private Ledger
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="sm" className="gap-1.5 text-xs font-medium shadow-xs">
                  Go to Dashboard <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm" className="gap-1.5 text-xs font-medium shadow-xs">
                    Access Ledger <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border/80 py-16 sm:py-24 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 text-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/80 border border-border/80 text-xs font-medium text-foreground backdrop-blur-sm shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Contract-grade private portfolio management</span>
              <span className="text-muted-foreground">•</span>
              <span className="font-mono text-[11px] text-muted-foreground">FY 2025–27</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.12]">
              Private investor portfolios, tracked with{" "}
              <span className="text-blue-600 dark:text-blue-400 underline decoration-blue-500/30 underline-offset-8">
                contract-grade certainty.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Record capital allocations, compute contractual 50% and 100% maturity distributions,
              and monitor month-by-month return schedules in a high-density, unified ledger.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href={isAuthenticated ? "/dashboard" : "/login"} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-xs font-medium h-11 px-6 shadow-sm">
                  {isAuthenticated ? `Go to Dashboard (${userName})` : "Access Portfolio Ledger"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <a href="#simulator" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-xs font-medium h-11 px-6">
                  <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                  Try Live Simulator
                </Button>
              </a>
            </div>

            {/* Key Value Metric Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-3xl mx-auto">
              <div className="p-3 rounded-lg border border-border/80 bg-card/60 text-left">
                <p className="text-[10px] text-muted-foreground uppercase font-medium">Return Multiplier</p>
                <p className="text-sm font-bold text-foreground font-mono mt-0.5">1.5x & 2.0x Tiers</p>
              </div>
              <div className="p-3 rounded-lg border border-border/80 bg-card/60 text-left">
                <p className="text-[10px] text-muted-foreground uppercase font-medium">Contract Term</p>
                <p className="text-sm font-bold text-foreground font-mono mt-0.5">12 Months Exact</p>
              </div>
              <div className="p-3 rounded-lg border border-border/80 bg-card/60 text-left">
                <p className="text-[10px] text-muted-foreground uppercase font-medium">Accrual Frequency</p>
                <p className="text-sm font-bold text-foreground font-mono mt-0.5">Monthly Linear</p>
              </div>
              <div className="p-3 rounded-lg border border-border/80 bg-card/60 text-left">
                <p className="text-[10px] text-muted-foreground uppercase font-medium">Settlement Status</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">Verified Payout</p>
              </div>
            </div>
          </div>
        </section>

        {/* Live Thing: Interactive Contract Simulator with Presets & Visual Timeline */}
        <section id="simulator" className="border-b border-border/80 py-16 bg-muted/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 text-[11px] font-semibold border border-blue-200 dark:border-blue-800/40">
                <Sparkles className="h-3 w-3" />
                Interactive Visual Model
              </div>
              <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-foreground">
                Contractual Return Calculator
              </h2>
              <p className="text-xs text-muted-foreground max-w-lg mx-auto">
                Select a preset or drag the slider to observe real-time monthly compounding and payout accrual.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-sm">
              {/* Presets Chips */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-foreground">Quick Allocation Presets:</span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setCalcAmount(preset.value)}
                      className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium border transition-all cursor-pointer ${
                        calcAmount === preset.value
                          ? "bg-foreground text-background border-foreground shadow-xs font-semibold scale-105"
                          : "bg-secondary text-muted-foreground border-border hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider & Tier Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-border/60">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-foreground">Principal Commitment:</span>
                    <span className="font-mono font-bold text-sm text-foreground tabular-nums">
                      ₹{calcAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="25000"
                    max="1000000"
                    step="25000"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Number(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>₹25k</span>
                    <span>₹2.5L</span>
                    <span>₹5L</span>
                    <span>₹7.5L</span>
                    <span>₹10L</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-medium text-foreground block">
                    Select Contractual ROI Tier:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setCalcRoi(50)}
                      className={`p-3 rounded-lg text-xs font-medium border transition-all cursor-pointer text-left ${
                        calcRoi === 50
                          ? "bg-foreground text-background border-foreground font-semibold shadow-xs"
                          : "bg-secondary/60 text-muted-foreground border-border hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        50% ROI Tier
                        {calcRoi === 50 && <span className="text-[10px]">✓</span>}
                      </div>
                      <div className="text-[10px] opacity-80 font-mono mt-0.5">1.5x Multiplier</div>
                    </button>
                    <button
                      onClick={() => setCalcRoi(100)}
                      className={`p-3 rounded-lg text-xs font-medium border transition-all cursor-pointer text-left ${
                        calcRoi === 100
                          ? "bg-foreground text-background border-foreground font-semibold shadow-xs"
                          : "bg-secondary/60 text-muted-foreground border-border hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        100% ROI Tier
                        {calcRoi === 100 && <span className="text-[10px]">✓</span>}
                      </div>
                      <div className="text-[10px] opacity-80 font-mono mt-0.5">2.0x Double Return</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Computed Output Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono tabular-nums">
                <div className="p-3.5 rounded-lg bg-secondary/50 border border-border/80">
                  <span className="text-[10px] font-sans text-muted-foreground uppercase font-medium block">
                    Principal
                  </span>
                  <p className="text-base font-bold text-foreground mt-1">
                    ₹{calcAmount.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-secondary/50 border border-border/80">
                  <span className="text-[10px] font-sans text-muted-foreground uppercase font-medium block">
                    Contractual Profit
                  </span>
                  <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    +₹{netProfit.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-secondary/50 border border-border/80">
                  <span className="text-[10px] font-sans text-muted-foreground uppercase font-medium block">
                    Monthly Accrual
                  </span>
                  <p className="text-base font-bold text-blue-600 dark:text-blue-400 mt-1">
                    +₹{monthlyAccrual.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} / mo
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-foreground text-background border border-foreground shadow-xs">
                  <span className="text-[10px] font-sans text-background/80 uppercase font-medium block">
                    Final Maturity Payout
                  </span>
                  <p className="text-base font-extrabold text-background mt-1">
                    ₹{maturityPayout.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* 12-Month Accrual Visual Progression Bar Graph */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-foreground">12-Month Accrual Visual Track:</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {activeMonthHover
                      ? `Month ${activeMonthHover}: Cumulative ₹${(calcAmount + monthlyAccrual * activeMonthHover).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                      : "Hover over months to preview balance"}
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-1.5 h-12 items-end pt-2">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                    const heightPercent = 25 + (m / 12) * 75;
                    const isHovered = activeMonthHover === m;

                    return (
                      <div
                        key={m}
                        onMouseEnter={() => setActiveMonthHover(m)}
                        onMouseLeave={() => setActiveMonthHover(null)}
                        className="group/bar relative flex flex-col items-center h-full justify-end cursor-pointer"
                      >
                        <div
                          className={`w-full rounded-xs transition-all duration-200 ${
                            isHovered
                              ? "bg-blue-600 dark:bg-blue-400 scale-105"
                              : "bg-blue-600/30 dark:bg-blue-400/30 group-hover/bar:bg-blue-600/60"
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[9px] font-mono text-muted-foreground mt-1">
                          M{m}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Specimen Section (Dummy Sample Data for Privacy) */}
        <section className="border-b border-border/80 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Specimen Ledger
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
                  Active Positions & Contract Dossiers
                </h2>
              </div>
              <Link href={isAuthenticated ? "/investments" : "/login"}>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  Inspect All Entries <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            {/* Specimen Table Card with Pure Dummy Sample Data */}
            <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
              <div className="p-4 border-b border-border/80 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Sample Portfolio Allocation • Illustrative Ledger</span>
                <span className="font-mono text-[11px]">3 Specimen Positions</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-border bg-muted/30 text-muted-foreground font-medium">
                    <tr>
                      <th className="py-2.5 px-4">Investor Allocation</th>
                      <th className="py-2.5 px-4 text-right">Principal</th>
                      <th className="py-2.5 px-4 text-right">Maturity Return</th>
                      <th className="py-2.5 px-4 text-right">Contract Gain</th>
                      <th className="py-2.5 px-4 text-center">Term Progress</th>
                      <th className="py-2.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-mono tabular-nums">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-sans font-medium text-foreground">
                        Kavita Mehta (Series A-1)
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">₹2,50,000</td>
                      <td className="py-3 px-4 text-right font-semibold text-foreground">₹3,75,000</td>
                      <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-medium">+₹1,25,000 (50%)</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">12/12 mo</td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant="success" className="text-[10px]">Settled</Badge>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-sans font-medium text-foreground">
                        Alexander Wright (Tranche II)
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">₹1,50,000</td>
                      <td className="py-3 px-4 text-right font-semibold text-foreground">₹2,25,000</td>
                      <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-medium">+₹75,000 (50%)</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">5/12 mo</td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant="warning" className="text-[10px]">Active</Badge>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-sans font-medium text-foreground">
                        Marcus Vance (High-Yield Note)
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">₹5,00,000</td>
                      <td className="py-3 px-4 text-right font-semibold text-foreground">₹10,00,000</td>
                      <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-medium">+₹5,00,000 (100%)</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">8/12 mo</td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant="warning" className="text-[10px]">Active</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Substantive Principles Section */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl border border-border/80 bg-card space-y-2.5 card-hover-lift">
                <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Percent className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Contractual Math Verification</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Strict 1.5x and 2.0x return logic with calculated monthly accrual rates and exact maturity dates.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border/80 bg-card space-y-2.5 card-hover-lift">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Lifecycle Accrual Ledgers</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Comprehensive monthly interest schedules tracking progress across 12-month contract lifecycles.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border/80 bg-card space-y-2.5 card-hover-lift">
                <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Sovereign Identification</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Aadhaar identification indexing, contact validation, and instant settlement status toggling.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 py-8 text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-foreground text-background flex items-center justify-center font-bold text-[10px]">
              IT
            </div>
            <span>InvestTracker Private Ledger • All figures in INR (₹)</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-foreground transition-colors">
              Access Account
            </Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
