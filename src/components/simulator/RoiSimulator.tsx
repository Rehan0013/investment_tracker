"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, Sparkles, TrendingUp, Wallet, ShieldCheck, Check } from "lucide-react";
import { motion } from "framer-motion";

const PRESET_AMOUNTS = [
  { label: "₹50K", value: 50000 },
  { label: "₹1 Lakh", value: 100000 },
  { label: "₹2.5 Lakh", value: 250000 },
  { label: "₹5 Lakh", value: 500000 },
  { label: "₹10 Lakh", value: 1000000 },
];

export function RoiSimulator() {
  const [calcAmount, setCalcAmount] = useState<number>(100000);
  const [calcRoi, setCalcRoi] = useState<number>(50);

  const multiplier = calcRoi === 100 ? 2.0 : 1.5;
  const returnAmount = calcAmount * multiplier;
  const netProfit = calcAmount * (calcRoi / 100);
  const monthlyAccrual = netProfit / 12;

  return (
    <div className="space-y-6">
      {/* Simulator Control Card */}
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-8 space-y-6 shadow-sm relative overflow-hidden transition-colors">
        {/* Ambient warm top glow in dark mode */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent pointer-events-none" />

        {/* Header inside card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[11px] font-semibold border border-violet-500/20 mb-1.5">
              <Sparkles className="h-3 w-3" />
              <span>Real-Time Yield Calculator</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Contractual Return Simulator
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configure capital commitment and observe dynamic 12-month compounding, payout, and monthly returns.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">Term:</span>
            <span className="px-3 py-1 rounded-full bg-secondary border border-border text-xs font-semibold text-foreground">
              12 Months Fixed
            </span>
          </div>
        </div>

        {/* Quick Allocation Presets */}
        <div className="space-y-2.5">
          <span className="text-xs font-semibold text-foreground">Quick Capital Presets:</span>
          <div className="flex flex-wrap gap-2">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setCalcAmount(preset.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border transition-all cursor-pointer active:scale-95 ${
                  calcAmount === preset.value
                    ? "bg-gradient-to-r from-[#a855f7] via-[#8b5cf6] to-[#7c3aed] text-white border-transparent shadow-sm font-semibold"
                    : "bg-secondary text-muted-foreground border-border hover:text-foreground hover:bg-muted"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slider & Tier Selectors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6 border-b border-border/80">
          {/* Slider & Manual Value */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground">Principal Commitment:</span>
              <span className="font-mono font-bold text-base text-foreground tabular-nums">
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
              className="w-full h-2.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-[#8b5cf6]"
            />

            <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
              <span>₹25k</span>
              <span>₹2.5L</span>
              <span>₹5L</span>
              <span>₹7.5L</span>
              <span>₹10L</span>
            </div>
          </div>

          {/* ROI Tiers */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-foreground block">
              Contractual Return Tier:
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCalcRoi(50)}
                className={`p-3.5 rounded-2xl text-xs font-medium border transition-all cursor-pointer text-left ${
                  calcRoi === 50
                    ? "bg-gradient-to-br from-violet-500/15 to-purple-500/10 border-violet-500/50 text-foreground ring-1 ring-violet-500/20"
                    : "bg-secondary/60 text-muted-foreground border-border hover:text-foreground hover:bg-muted"
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>50% ROI Tier</span>
                  {calcRoi === 50 && (
                    <span className="w-4 h-4 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground font-mono mt-1">
                  1.5x Multiplier Payout
                </p>
              </button>

              <button
                onClick={() => setCalcRoi(100)}
                className={`p-3.5 rounded-2xl text-xs font-medium border transition-all cursor-pointer text-left ${
                  calcRoi === 100
                    ? "bg-gradient-to-br from-emerald-500/15 to-teal-500/10 border-emerald-500/50 text-foreground ring-1 ring-emerald-500/20"
                    : "bg-secondary/60 text-muted-foreground border-border hover:text-foreground hover:bg-muted"
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>100% ROI Tier</span>
                  {calcRoi === 100 && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground font-mono mt-1">
                  2.0x Double Return Payout
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Computed Output Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono tabular-nums">
          <div className="p-4 rounded-2xl bg-secondary/50 border border-border/80">
            <span className="text-[10px] font-sans text-muted-foreground uppercase font-semibold block">
              Principal
            </span>
            <p className="text-base sm:text-lg font-bold text-foreground mt-1">
              ₹{calcAmount.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-secondary/50 border border-border/80">
            <span className="text-[10px] font-sans text-muted-foreground uppercase font-semibold block">
              Monthly Credit
            </span>
            <p className="text-base sm:text-lg font-bold text-foreground mt-1">
              ₹{Math.round(monthlyAccrual).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10px] font-sans text-emerald-600 dark:text-emerald-400 uppercase font-semibold block">
              Net Gain (+{calcRoi}%)
            </span>
            <p className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              +₹{netProfit.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20">
            <span className="text-[10px] font-sans text-violet-600 dark:text-violet-400 uppercase font-semibold block">
              Maturity Payout ({multiplier}x)
            </span>
            <p className="text-base sm:text-lg font-bold text-violet-600 dark:text-violet-400 mt-1">
              ₹{returnAmount.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* 12-Month Simulated Compounding Flow */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-violet-500" />
              12-Month Capital Growth Projection
            </span>
            <span className="font-mono text-muted-foreground text-[11px]">
              Rate: ₹{Math.round(monthlyAccrual).toLocaleString("en-IN")} / month
            </span>
          </div>

          {/* Month Segment Pills */}
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
            {Array.from({ length: 12 }).map((_, i) => {
              const currentVal = calcAmount + monthlyAccrual * (i + 1);
              return (
                <div
                  key={i}
                  className="p-2 rounded-xl border border-border/80 bg-secondary/40 text-center space-y-1 hover:border-primary/40 transition-colors"
                >
                  <p className="text-[9px] text-muted-foreground font-mono">M{i + 1}</p>
                  <p className="text-[10px] font-bold text-foreground font-mono tabular-nums truncate">
                    ₹{Math.round(currentVal / 1000)}k
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button: Record This Position */}
        <div className="pt-4 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Guaranteed contractual calculation based on standard ledger formulas.</span>
          </div>

          <Link href="/investments/new" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:brightness-110 text-white text-xs font-semibold shadow-lg shadow-violet-500/25 transition-all active:scale-95 cursor-pointer">
              <span>Record Position With These Terms</span>
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

