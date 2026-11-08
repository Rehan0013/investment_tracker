"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Sparkles,
  Layers,
  Percent,
  Eye,
  CheckCircle2,
  ChevronDown,
  Building2,
  CreditCard,
  Smartphone,
  Zap,
  Lock,
  ArrowUpRight,
  Check,
  Play,
  Share2,
  Search,
  Bell,
  Coins,
  Receipt,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, useReducedMotion } from "framer-motion";
import { BannerCarousel, BannerItem } from "@/components/shared/BannerCarousel";
import { getActiveBanners } from "@/actions/banner.actions";

const PRESET_AMOUNTS = [
  { label: "₹50K", value: 50000 },
  { label: "₹1 Lakh", value: 100000 },
  { label: "₹2.5 Lakh", value: 250000 },
  { label: "₹5 Lakh", value: 500000 },
  { label: "₹10 Lakh", value: 1000000 },
];

const FAQS = [
  {
    q: "What is this platform used for?",
    a: "Our platform helps you record private syndicate investments, calculate contractual 50% and 100% maturity distributions, track investor and owner bonuses, and verify bank settlements with IFSC dossiers.",
  },
  {
    q: "Is my financial data and investor ledger secure?",
    a: "Yes. All records are stored with encrypted sessions, strict role-based access, and immutable audit logs to protect syndicate investor confidentiality.",
  },
  {
    q: "Can I record bank accounts and settlement details?",
    a: "Yes. Once an investment matures at 12 months, the platform activates bank settlement dossiers where you record Account Number, IFSC code, Bank Name, and Account Holder Name for instant payout verification.",
  },
  {
    q: "How does the contractual 50% and 100% ROI yield work?",
    a: "Every investment is locked for a 12-month tenure. 50% ROI yields a 1.5x payout at maturity, while 100% ROI yields a 2.0x doubled principal payout, with linear monthly accrual tracking.",
  },
  {
    q: "How quickly can I get started?",
    a: "Instantaneously. Sign in to your private ledger, input investor commitments, configure bonus splits, and monitor your entire valuation in real-time.",
  },
];

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const userName =
    session?.user?.name || session?.user?.email?.split("@")[0] || "User";

  // Interactive Live Thing: Contract ROI Simulator
  const [calcAmount, setCalcAmount] = useState(100000);
  const [calcRoi, setCalcRoi] = useState(50);
  const [activeMonthHover, setActiveMonthHover] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [banners, setBanners] = useState<BannerItem[]>([]);

  useEffect(() => {
    getActiveBanners().then((res) => {
      if (res?.success && res.banners) {
        setBanners(res.banners);
      }
    });
  }, []);

  const multiplier = calcRoi === 100 ? 2.0 : 1.5;
  const maturityPayout = calcAmount * multiplier;
  const netProfit = calcAmount * (calcRoi / 100);
  const monthlyAccrual = netProfit / 12;

  // Investor & Owner Bonus Model
  const investorBonus = calcAmount * 0.05;
  const ownerBonus = calcAmount * 0.025;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-[#ff5722] selection:text-white overflow-x-hidden transition-colors">
      {/* Top Navigation Bar */}
      <header className="border-b border-border dark:border-white/[0.08] bg-background/90 dark:bg-[#08090c]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#ff5722] to-[#ff7a45] text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,87,34,0.4)] group-hover:scale-105 transition-transform">
              <Eye className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-foreground leading-none">
                Eye-Vision
              </span>
              <span className="text-[10px] text-muted-foreground font-mono leading-none mt-1 tracking-wider uppercase">
                Syndicate Capital
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-muted-foreground dark:text-zinc-300">
            <a href="#hero" className="text-foreground dark:text-white hover:text-[#ff5722] transition-colors">
              Home
            </a>
            <a href="#simulator" className="hover:text-[#ff5722] transition-colors">
              Technology
            </a>
            <a href="#features" className="hover:text-[#ff5722] transition-colors">
              Features
            </a>
            <a href="#faq" className="hover:text-[#ff5722] transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="rounded-full bg-[#ff5722] hover:bg-[#f4511e] text-white px-5 text-xs font-semibold shadow-[0_0_20px_rgba(255,87,34,0.35)] transition-all hover:scale-105 cursor-pointer"
                >
                  Dashboard <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                {/* <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-medium text-muted-foreground hover:text-foreground rounded-full px-3.5"
                  >
                    Log In
                  </Button>
                </Link> */}
                <Link href="/login">
                  <Button
                    size="sm"
                    className="rounded-full bg-[#ff5722] hover:bg-[#f4511e] text-white px-4 sm:px-5 text-xs font-semibold shadow-[0_0_20px_rgba(255,87,34,0.35)] transition-all hover:scale-105 cursor-pointer"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* HERO SECTION WITH HORIZON GLOW ARC */}
        <section id="hero" className="relative pt-16 sm:pt-24 pb-20 overflow-hidden">
          {/* Subtle Ambient Background Gradient Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,87,34,0.12),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,87,34,0.18),rgba(0,0,0,0))] pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
            {/* Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/80 dark:bg-white/[0.05] border border-border dark:border-white/[0.1] text-xs font-medium text-muted-foreground dark:text-zinc-300 backdrop-blur-md shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#ff5722] shadow-[0_0_8px_#ff5722] animate-pulse" />
              <span>Manage Your Finances & Syndicate Capital</span>
            </div>

            {/* Cinematic Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground dark:text-white max-w-4xl mx-auto leading-[1.08]">
              Finance That Grows with{" "}
              <span className="bg-gradient-to-r from-[#ff5722] via-[#ff7a45] to-amber-500 bg-clip-text text-transparent">
                Your Ambition
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-muted-foreground dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Unlock powerful tools to manage, track, and scale your finances seamlessly.
              Designed to support your goals at every stage of growth.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link href={isAuthenticated ? "/dashboard" : "/login"} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full bg-[#ff5722] hover:bg-[#f4511e] text-white font-semibold text-xs sm:text-sm h-12 px-7 shadow-[0_0_25px_rgba(255,87,34,0.4)] transition-all hover:scale-105"
                >
                  {isAuthenticated ? `Enter Dashboard (${userName})` : "Get Started Free"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <a href="#simulator" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto rounded-full border-border dark:border-white/[0.12] bg-card dark:bg-white/[0.04] hover:bg-secondary dark:hover:bg-white/[0.08] text-foreground dark:text-white font-medium text-xs sm:text-sm h-12 px-7 backdrop-blur-md"
                >
                  <Play className="h-3.5 w-3.5 mr-2 fill-current" />
                  Try Simulator
                </Button>
              </a>
            </div>
          </div>


          {/* Stylish Festival & Bonus Announcement 3D Arc Carousel (Visible only if banners exist) */}
          {banners.length > 0 && (
            <section className="py-8 sm:py-14 w-full overflow-hidden relative">
              <BannerCarousel banners={banners} variant="landing" />
            </section>
          )}

          {/* RADIANT HORIZON ARC GLOW (Signature RichPath Visual) */}
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[85%] h-36 bg-gradient-to-b from-[#ff5722]/25 dark:from-[#ff5722]/30 via-[#ff5722]/10 to-transparent blur-3xl pointer-events-none rounded-t-[100%]" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-[70%] h-px bg-gradient-to-r from-transparent via-[#ff5722] to-transparent shadow-[0_0_20px_#ff5722]" />

            {/* EMBEDDED DASHBOARD SHOWCASE CARD */}
            <div className="relative rounded-2xl border border-border dark:border-white/[0.12] bg-card dark:bg-[#101116] p-4 sm:p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden transition-colors">
              {/* Inner ambient glow */}
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ff5722]/5 rounded-full blur-3xl pointer-events-none" />

              {/* Showcase Top Window Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-border/80 dark:border-white/[0.06] gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#ff5722]/15 border border-[#ff5722]/30 text-[#ff5722] flex items-center justify-center font-bold text-xs">
                    EV
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground dark:text-white leading-tight">
                      Good morning, {userName}
                    </h3>
                    <p className="text-xs text-muted-foreground dark:text-zinc-400 mt-0.5">
                      Stay on top of your tasks, monitor progress, and track status.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="relative hidden sm:block">
                    <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search ledger..."
                      readOnly
                      className="h-8 pl-8 pr-3 rounded-full bg-secondary dark:bg-white/[0.04] border border-border dark:border-white/[0.08] text-xs text-foreground dark:text-zinc-300 w-48 focus:outline-hidden"
                    />
                  </div>
                  <div className="h-8 w-8 rounded-full bg-secondary dark:bg-white/[0.05] border border-border dark:border-white/[0.08] flex items-center justify-center text-muted-foreground dark:text-zinc-300">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#ff5722] to-amber-500 text-white flex items-center justify-center font-bold text-xs">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Showcase Metric & Card Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
                {/* Total Balance Card */}
                <div className="lg:col-span-4 rounded-xl bg-secondary/40 dark:bg-white/[0.02] border border-border dark:border-white/[0.08] p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground dark:text-zinc-400 font-medium">Total Balance</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-foreground dark:text-white tracking-tight mt-1 font-mono">
                      ₹6,89,372.00
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <Button
                      size="sm"
                      className="rounded-full bg-secondary hover:bg-secondary/80 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-foreground dark:text-white border border-border dark:border-white/[0.08] text-xs h-8 px-4 flex-1"
                    >
                      + Transfer
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full bg-secondary/60 hover:bg-secondary dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-muted-foreground dark:text-zinc-300 text-xs h-8 px-4 flex-1"
                    >
                      Request
                    </Button>
                  </div>
                </div>

                {/* Right Top Mini Cards: Total Earnings (Orange Card), Spending, Income */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Signature Radiant Orange Gradient Card */}
                  <div className="rounded-xl p-5 orange-gradient-card flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white/90">Total Earnings</span>
                      <span className="text-[10px] font-mono font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-white">
                        +50% ROI
                      </span>
                    </div>
                    <div className="pt-3">
                      <div className="text-2xl font-black tracking-tight font-mono text-white">
                        ₹95,000
                      </div>
                      <p className="text-[11px] text-white/85 mt-1">
                        Contractual distribution
                      </p>
                    </div>
                  </div>

                  {/* Spending Card */}
                  <div className="rounded-xl p-5 bg-secondary/40 dark:bg-white/[0.02] border border-border dark:border-white/[0.08] flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground dark:text-zinc-400">Disbursed / Payouts</span>
                      <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="pt-3">
                      <div className="text-2xl font-bold tracking-tight text-foreground dark:text-white font-mono">
                        ₹7,000
                      </div>
                      <p className="text-[11px] text-muted-foreground dark:text-zinc-400 mt-1">Maturity settlements</p>
                    </div>
                  </div>

                  {/* Bonus Card */}
                  <div className="rounded-xl p-5 bg-secondary/40 dark:bg-white/[0.02] border border-border dark:border-white/[0.08] flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground dark:text-zinc-400">Total Bonus</span>
                      <Coins className="w-3.5 h-3.5 text-[#ff5722]" />
                    </div>
                    <div className="pt-3">
                      <div className="text-2xl font-bold tracking-tight text-foreground dark:text-white font-mono">
                        ₹1,050
                      </div>
                      <p className="text-[11px] text-muted-foreground dark:text-zinc-400 mt-1">Investor + Owner Bonus</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profit & Loss Showcase Bar Chart with Floating Orange Tooltip */}
              <div className="rounded-xl bg-secondary/40 dark:bg-white/[0.02] border border-border dark:border-white/[0.08] p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2 border-b border-border/80 dark:border-white/[0.06]">
                  <div>
                    <h4 className="text-sm font-bold text-foreground dark:text-white">Profit and Loss</h4>
                    <p className="text-xs text-muted-foreground dark:text-zinc-400">
                      Show your cashflow in a certain period of time
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#ff5722] bg-[#ff5722]/10 px-2.5 py-1 rounded-full border border-[#ff5722]/20 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff5722]" />
                      Net Gain: +₹2,34,500
                    </span>
                  </div>
                </div>

                <div className="relative pt-8 pb-3">
                  {/* Floating Coral Orange Pill Badge / Tooltip */}
                  <div className="absolute top-0 right-1/4 sm:right-1/3 -translate-y-1 bg-[#ff5722] text-white text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl shadow-[0_4px_20px_rgba(255,87,34,0.45)] flex flex-col z-20 pointer-events-none">
                    <span className="text-[9px] text-white/80 uppercase">June 20, 2026</span>
                    <span className="text-xs font-bold">+₹23,450.00</span>
                  </div>

                  {/* Visual Bars matching the reference bar graph */}
                  <div className="grid grid-cols-12 gap-2 sm:gap-3.5 h-36 items-end pt-4">
                    {[
                      { m: "Jan", h: 40, p: false },
                      { m: "Feb", h: 65, p: false },
                      { m: "Mar", h: 50, p: false },
                      { m: "Apr", h: 35, p: false },
                      { m: "May", h: 75, p: false },
                      { m: "Jun", h: 95, p: true }, // Peak bar with tooltip
                      { m: "Jul", h: 80, p: false },
                      { m: "Aug", h: 60, p: false },
                      { m: "Sep", h: 45, p: false },
                      { m: "Oct", h: 70, p: false },
                      { m: "Nov", h: 85, p: false },
                      { m: "Dec", h: 90, p: false },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center h-full justify-end group">
                        <div
                          className={`w-full rounded-t-sm transition-all duration-300 ${item.p
                            ? "bg-[#ff5722] shadow-[0_0_15px_rgba(255,87,34,0.5)]"
                            : "bg-[#ff5722]/30 dark:bg-[#ff5722]/40 hover:bg-[#ff5722]/80"
                            }`}
                          style={{ height: `${item.h}%` }}
                        />
                        <span className="text-[10px] text-muted-foreground dark:text-zinc-400 font-mono mt-2">
                          {item.m}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUSTED BY 4,000+ COMPANIES BANNER */}
        {/* <section className="py-12 border-y border-border dark:border-white/[0.06] bg-muted/40 dark:bg-[#0c0d12]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <p className="text-xs uppercase font-mono tracking-wider text-muted-foreground dark:text-zinc-400">
              Trusted by 4,000+ Growing Companies & Syndicate Desks
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all text-sm font-semibold tracking-wide text-foreground dark:text-zinc-300">
              <span className="flex items-center gap-2">● Spotify</span>
              <span className="flex items-center gap-2">◆ coinbase</span>
              <span className="flex items-center gap-2"># slack</span>
              <span className="flex items-center gap-2">❖ Dropbox</span>
              <span className="flex items-center gap-2">▲ zoom</span>
              <span className="flex items-center gap-2">W Webflow</span>
            </div>
          </div>
        </section> */}

        {/* 4-CARD BENTO SECTION: "FINANCE FOR THE MODERN BUSINESS" */}
        <section id="features" className="py-24 max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground dark:text-white">
              Finance for the Modern Syndicate
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground dark:text-zinc-400 leading-relaxed">
              Tailored financial tools designed to simplify management, boost efficiency, and
              support your syndicate's growth in today's fast-paced world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Supports Any Payment Gateway */}
            <div className="rounded-2xl bg-card dark:bg-[#101116] border border-border dark:border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between hover:border-primary/40 dark:hover:border-white/[0.14] transition-all shadow-sm">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground dark:text-white">Supports Any Payment Gateway</h3>
                <p className="text-xs text-muted-foreground dark:text-zinc-400 leading-relaxed">
                  Connect effortlessly with any payment gateway to accept investments seamlessly and
                  keep your settlement transactions running smoothly.
                </p>
              </div>

              {/* Graphic Specimen: Payment Card & Gateways */}
              <div className="mt-8 pt-6 border-t border-border/80 dark:border-white/[0.06] flex items-center justify-center">
                <div className="w-full max-w-xs p-5 rounded-xl bg-gradient-to-tr from-[#ff5722] to-[#ff7a45] text-white shadow-[0_15px_35px_rgba(255,87,34,0.3)] space-y-4">
                  <div className="flex justify-between items-center text-xs opacity-90">
                    <span className="font-mono">Settlement Pass</span>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-mono font-bold tracking-widest">
                      •••• 5824 9912
                    </div>
                    <div className="flex justify-between text-[10px] opacity-80 font-mono">
                      <span>EXP: 12/28</span>
                      <span>IMPS / NEFT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Automated Payment Scheduling with Concentric Orbital Rings */}
            <div className="rounded-2xl bg-card dark:bg-[#101116] border border-border dark:border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between hover:border-primary/40 dark:hover:border-white/[0.14] transition-all shadow-sm">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground dark:text-white">Automated Maturity Scheduling</h3>
                <p className="text-xs text-muted-foreground dark:text-zinc-400 leading-relaxed">
                  Schedule payouts in advance and automate recurring bonus accruals to stay organized
                  and never miss a contractual settlement due date.
                </p>
              </div>

              {/* Planetary Orbital Graphic Specimen */}
              <div className="mt-8 pt-6 border-t border-border/80 dark:border-white/[0.06] flex items-center justify-center overflow-hidden">
                <div className="relative w-60 h-60 flex items-center justify-center select-none">
                  {/* Sun / Core Ambient Glow */}
                  <motion.div
                    className="absolute w-20 h-20 rounded-full bg-[#ff5722]/15 blur-xl pointer-events-none"
                    animate={shouldReduceMotion ? undefined : { scale: [1, 1.25, 1], opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Outer Orbit Track */}
                  <div className="absolute inset-2 rounded-full border border-dashed border-border dark:border-white/[0.1] pointer-events-none" />

                  {/* Outer Planet Orbit (Alexander Wright - AW) */}
                  <motion.div
                    className="absolute inset-2 rounded-full pointer-events-none"
                    animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                  >
                    {/* Planet positioned on perimeter at 12 o'clock */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto group/planet">
                      <motion.div
                        animate={shouldReduceMotion ? undefined : { rotate: -360 }}
                        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                        className="h-8 w-8 rounded-full bg-card dark:bg-zinc-800 border border-border dark:border-white/20 shadow-md flex items-center justify-center text-[10px] font-bold text-foreground dark:text-white transition-transform group-hover/planet:scale-125 relative cursor-pointer"
                        title="Alexander Wright (12M Due)"
                      >
                        AW
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute -bottom-0.5 -right-0.5 ring-1 ring-card" />
                      </motion.div>
                    </div>

                    {/* Secondary Satellite Micro Orb on Outer Track at 6 o'clock */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-auto">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5722] shadow-[0_0_8px_#ff5722]" />
                    </div>
                  </motion.div>

                  {/* Mid Orbit Track */}
                  <div className="absolute inset-8 rounded-full border border-border/80 dark:border-white/[0.08] pointer-events-none" />

                  {/* Mid Planet Orbit (Kavita Mehta - KM) - Retrograde rotation for visual contrast */}
                  <motion.div
                    className="absolute inset-8 rounded-full pointer-events-none"
                    animate={shouldReduceMotion ? undefined : { rotate: -360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  >
                    {/* Planet positioned on perimeter at 9 o'clock */}
                    <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-auto group/planet">
                      <motion.div
                        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                        className="h-7 w-7 rounded-full bg-card dark:bg-zinc-800 border border-emerald-500/40 shadow-md flex items-center justify-center text-[9px] font-bold text-foreground dark:text-white transition-transform group-hover/planet:scale-125 relative cursor-pointer"
                        title="Kavita Mehta (Active 50%)"
                      >
                        KM
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 animate-pulse" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Inner Orbit Track */}
                  <div className="absolute inset-14 rounded-full border border-[#ff5722]/30 bg-[#ff5722]/5 pointer-events-none" />

                  {/* Inner Planet Orbit (Marcus Vance - MV) */}
                  <motion.div
                    className="absolute inset-14 rounded-full pointer-events-none"
                    animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                    transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
                  >
                    {/* Planet positioned on perimeter at 3 o'clock */}
                    <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 pointer-events-auto group/planet">
                      <motion.div
                        animate={shouldReduceMotion ? undefined : { rotate: -360 }}
                        transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
                        className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#ff6b35] to-[#ff5722] text-white border border-white/30 shadow-[0_0_14px_rgba(255,87,34,0.5)] flex items-center justify-center text-[9px] font-bold transition-transform group-hover/planet:scale-125 cursor-pointer"
                        title="Marcus Vance (100% Note)"
                      >
                        MV
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Center Sun / Eye-Vision Capital Core */}
                  <motion.div
                    className="relative z-10 h-12 w-12 rounded-full bg-gradient-to-tr from-[#ff5722] via-[#ff6b35] to-amber-500 text-white flex items-center justify-center shadow-[0_0_24px_rgba(255,87,34,0.6)] font-bold text-base ring-2 ring-white/30 cursor-pointer"
                    animate={shouldReduceMotion ? undefined : { scale: [1, 1.06, 1] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    title="Maturity Settlement Sun Core"
                  >
                    ₹
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Card 3: Payments Without Limits / Investor Settlement Ledger */}
            <div className="rounded-2xl bg-card dark:bg-[#101116] border border-border dark:border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between hover:border-primary/40 dark:hover:border-white/[0.14] transition-all shadow-sm">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground dark:text-white">Payments Without Limits</h3>
                <p className="text-xs text-muted-foreground dark:text-zinc-400 leading-relaxed">
                  Send and receive returns anytime, anywhere, without restrictions — empowering your
                  syndicate to operate freely.
                </p>
              </div>

              {/* Verified Contact List */}
              <div className="mt-8 pt-6 border-t border-border/80 dark:border-white/[0.06] space-y-2.5">
                {[
                  { name: "Arjun Malik", id: "HDFC0001234", amount: "+₹3,75,000", tag: "Settled" },
                  { name: "Neil Kumar", id: "SBIN0005678", amount: "+₹2,25,000", tag: "Active" },
                  { name: "Dev Patel", id: "ICIC0009876", amount: "+₹10,00,000", tag: "Active" },
                ].map((inv, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-secondary/50 dark:bg-white/[0.02] border border-border/70 dark:border-white/[0.06] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-[#ff5722]/10 text-[#ff5722] border border-[#ff5722]/20 flex items-center justify-center font-bold text-[10px]">
                        {inv.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground dark:text-white">{inv.name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{inv.id}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{inv.amount}</div>
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
                        {inv.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4: Real-Time Return & Expense Tracking */}
            <div className="rounded-2xl bg-card dark:bg-[#101116] border border-border dark:border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between hover:border-primary/40 dark:hover:border-white/[0.14] transition-all shadow-sm">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground dark:text-white">Real-Time Accrual Tracking</h3>
                <p className="text-xs text-muted-foreground dark:text-zinc-400 leading-relaxed">
                  Monitor every return and bonus as it happens, giving you instant clarity and full
                  control over your syndicate portfolio.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-border/80 dark:border-white/[0.06]">
                <div className="p-4 rounded-xl bg-secondary/50 dark:bg-white/[0.02] border border-border/70 dark:border-white/[0.06] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-foreground dark:text-white">Monthly Accrual Progress</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">+50.0% Net Yield</span>
                  </div>
                  <div className="w-full bg-secondary dark:bg-white/[0.06] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#ff5722] to-amber-500 h-full rounded-full w-[75%]" />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>Active: 9/12 Months</span>
                    <span>Accrued: ₹75,000 / ₹1,00,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE CONTRACT SIMULATOR WITH PRESETS & LIVE BONUS COMPUTATION */}
        <section id="simulator" className="py-20 border-t border-border dark:border-white/[0.06] bg-muted/30 dark:bg-[#0c0d12]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff5722]/10 border border-[#ff5722]/30 text-[#ff5722] text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                Live Interactive Calculator
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground dark:text-white">
                Contractual Return & Bonus Simulator
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground dark:text-zinc-400 max-w-xl mx-auto">
                Test commitment allocations in real time. Observe monthly accrual rates, final maturity
                payouts, and investor + owner bonuses.
              </p>
            </div>

            <div className="rounded-2xl border border-border dark:border-white/[0.08] bg-card dark:bg-[#101116] p-6 sm:p-8 space-y-6 shadow-xl">
              {/* Presets Chips */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-foreground">Quick Allocation Presets:</span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setCalcAmount(preset.value)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border transition-all cursor-pointer ${calcAmount === preset.value
                        ? "bg-[#ff5722] text-white border-[#ff5722] shadow-[0_0_12px_rgba(255,87,34,0.4)] font-bold scale-105"
                        : "bg-secondary dark:bg-white/[0.04] text-muted-foreground border-border dark:border-white/[0.08] hover:text-foreground hover:bg-muted"
                        }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider & Tier Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-border/80 dark:border-white/[0.06]">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-foreground">Principal Commitment:</span>
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
                    className="w-full h-2 bg-secondary dark:bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-[#ff5722]"
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
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => setCalcRoi(50)}
                      className={`p-3.5 rounded-xl text-xs font-medium border transition-all cursor-pointer text-left ${calcRoi === 50
                        ? "bg-[#ff5722]/15 text-foreground dark:text-white border-[#ff5722] shadow-[0_0_15px_rgba(255,87,34,0.15)] font-semibold"
                        : "bg-secondary/60 dark:bg-white/[0.03] text-muted-foreground border-border dark:border-white/[0.08] hover:text-foreground"
                        }`}
                    >
                      <div className="font-bold flex items-center justify-between text-foreground dark:text-white">
                        50% ROI Tier
                        {calcRoi === 50 && <span className="text-[10px] text-[#ff5722]">✓</span>}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-1">1.5x Return</div>
                    </button>
                    <button
                      onClick={() => setCalcRoi(100)}
                      className={`p-3.5 rounded-xl text-xs font-medium border transition-all cursor-pointer text-left ${calcRoi === 100
                        ? "bg-[#ff5722]/15 text-foreground dark:text-white border-[#ff5722] shadow-[0_0_15px_rgba(255,87,34,0.15)] font-semibold"
                        : "bg-secondary/60 dark:bg-white/[0.03] text-muted-foreground border-border dark:border-white/[0.08] hover:text-foreground"
                        }`}
                    >
                      <div className="font-bold flex items-center justify-between text-foreground dark:text-white">
                        100% ROI Tier
                        {calcRoi === 100 && <span className="text-[10px] text-[#ff5722]">✓</span>}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-1">2.0x Double Return</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Computed Output Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono tabular-nums">
                <div className="p-3.5 rounded-xl bg-secondary/50 dark:bg-white/[0.03] border border-border dark:border-white/[0.08]">
                  <span className="text-[10px] font-sans text-muted-foreground uppercase font-medium block">
                    Principal
                  </span>
                  <p className="text-base font-bold text-foreground mt-1">
                    ₹{calcAmount.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-secondary/50 dark:bg-white/[0.03] border border-border dark:border-white/[0.08]">
                  <span className="text-[10px] font-sans text-muted-foreground uppercase font-medium block">
                    Contractual Profit
                  </span>
                  <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    +₹{netProfit.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-secondary/50 dark:bg-white/[0.03] border border-border dark:border-white/[0.08]">
                  <span className="text-[10px] font-sans text-muted-foreground uppercase font-medium block">
                    Monthly Accrual
                  </span>
                  <p className="text-base font-bold text-[#ff5722] mt-1">
                    +₹{monthlyAccrual.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} / mo
                  </p>
                </div>
                <div className="p-3.5 rounded-xl orange-gradient-card">
                  <span className="text-[10px] font-sans text-white/90 uppercase font-medium block">
                    Final Maturity Payout
                  </span>
                  <p className="text-base font-extrabold text-white mt-1">
                    ₹{maturityPayout.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Bonus Breakdown Strip */}
              <div className="p-4 rounded-xl bg-secondary/40 dark:bg-white/[0.02] border border-border/80 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#ff5722]" />
                  <span className="text-foreground font-medium">Automatic Bonus Allocation:</span>
                </div>
                <div className="flex items-center gap-4 font-mono text-[11px]">
                  <span className="text-foreground">
                    Investor Bonus: <strong className="text-emerald-600 dark:text-emerald-400">+₹{investorBonus.toLocaleString("en-IN")}</strong>
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-foreground">
                    Owner Bonus: <strong className="text-[#ff5722]">+₹{ownerBonus.toLocaleString("en-IN")}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6-CARD GRID: "BANKING REIMAGINED FOR THE FUTURE YOU" */}
        <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground dark:text-white">
              Banking Reimagined for the Future You
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground dark:text-zinc-400 leading-relaxed">
              Trust us to deliver cutting-edge innovation, transparency, and personalized service,
              all designed to help you achieve financial freedom.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Zap,
                title: "Instant Account Setup",
                desc: "Begin recording investments in seconds with encrypted sessions and immediate portfolio tracking.",
              },
              {
                icon: CreditCard,
                title: "Real-Time Payments & Settlements",
                desc: "Enable instant payout verification, bank account records, and automated IFSC routing.",
              },
              {
                icon: Smartphone,
                title: "Mobile Banking & Responsive UI",
                desc: "Touch-optimized interface built for fluid mobile use on iPhone, Android, and tablets.",
              },
              {
                icon: Sparkles,
                title: "AI-Powered Budgeting & Returns",
                desc: "Predictive linear accrual math projecting portfolio valuations across 12-month contract lifecycles.",
              },
              {
                icon: ShieldCheck,
                title: "Strict Bank Settlement Dossiers",
                desc: "Capture bank name, account number, IFSC code, and account holder name once investments mature.",
              },
              {
                icon: Coins,
                title: "Dual Bonus Allocation",
                desc: "Separate tracking of investor bonuses and account owner bonuses with aggregate ledger rollups.",
              },
            ].map((feature, idx) => {
              const IconComp = feature.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-card dark:bg-[#101116] border border-border dark:border-white/[0.08] p-6 space-y-3 hover:border-primary/40 dark:hover:border-white/[0.14] transition-all shadow-sm group"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#ff5722]/10 border border-[#ff5722]/20 text-[#ff5722] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <IconComp className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h3 className="text-base font-bold text-foreground dark:text-white">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Clear answers to common questions about our platform.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-card dark:bg-[#101116] border border-border dark:border-white/[0.08] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-foreground dark:text-white hover:text-[#ff5722] transition-colors cursor-pointer"
                  >
                    <span>
                      {idx + 1}. {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180 text-[#ff5722]" : ""
                        }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-muted-foreground dark:text-zinc-400 leading-relaxed border-t border-border/60 dark:border-white/[0.04] pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* NEWSLETTER & TRIGGER NEXT MILESTONE CTA STRIP */}
        {/* <section className="py-20 border-t border-border dark:border-white/[0.06] bg-muted/30 dark:bg-[#0c0d12]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground dark:text-white">
                Ready to trigger your next milestone?
              </h3>
              <p className="text-xs text-muted-foreground">
                Join thousands of syndicate managers and track high-yield capital with precision.
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-11 px-4 rounded-full bg-background dark:bg-white/[0.04] border border-border dark:border-white/[0.1] text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-[#ff5722] w-full sm:w-64"
              />
              <Button className="rounded-full bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-bold h-11 px-6 shadow-[0_0_20px_rgba(255,87,34,0.35)] shrink-0 cursor-pointer">
                Subscribe
              </Button>
            </div>
          </div>
        </section> */}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border dark:border-white/[0.06] py-12 bg-background dark:bg-[#08090c] text-xs text-muted-foreground dark:text-zinc-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-[#ff5722] text-white flex items-center justify-center font-bold text-xs">
                EV
              </div>
              <span className="font-bold text-sm text-foreground dark:text-white">Eye-Vision</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Institutional-grade syndicate investment ledger, contractual ROI verification, and
              automated maturity settlements.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground dark:text-white text-xs mb-3">Product</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#simulator" className="hover:text-foreground">Calculator</a></li>
              <li><a href="#features" className="hover:text-foreground">Features</a></li>
              <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground dark:text-white text-xs mb-3">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><span className="hover:text-foreground cursor-pointer">About Us</span></li>
              <li><span className="hover:text-foreground cursor-pointer">Security</span></li>
              <li><span className="hover:text-foreground cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-foreground cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground dark:text-white text-xs mb-3">Platform</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/login" className="hover:text-foreground">Sign In</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
              <li><span className="text-[11px] font-mono text-muted-foreground">v2.4.0</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 mt-8 border-t border-border/80 dark:border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <div>© {new Date().getFullYear()} Eye-Vision Technologies. All rights reserved.</div>
          <div className="flex items-center gap-2 font-mono">
            <span>Adaptive Light & Dark Edition</span>
            <span>•</span>
            <span>INR (₹) Ledger Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
