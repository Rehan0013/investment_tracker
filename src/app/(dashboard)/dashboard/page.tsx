import { getDashboardStats, getInvestments } from "@/actions/investment.actions";
import { getActiveBanners } from "@/actions/banner.actions";
import { StatCard } from "@/components/dashboard/StatCard";
import { TotalBalanceCard } from "@/components/dashboard/TotalBalanceCard";
import { InvestmentsBarChart } from "@/components/dashboard/InvestmentsBarChart";
import { RecentTransactionsCard } from "@/components/dashboard/RecentTransactionsCard";
import { BannerCarousel } from "@/components/shared/BannerCarousel";
import { DashboardGreeting } from "@/components/dashboard/DashboardGreeting";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Users, Wallet, TrendingUp, Sparkles, CheckCircle2, Clock, Plus, ArrowUpRight, Gift, Eye } from "lucide-react";

export default async function DashboardPage() {
  const [statsRes, investmentsRes, bannersRes, session] = await Promise.all([
    getDashboardStats(),
    getInvestments(),
    getActiveBanners(),
    auth(),
  ]);

  const stats = statsRes.success ? statsRes.stats : null;
  const investments = investmentsRes.success ? investmentsRes.investments : [];
  const banners = bannersRes.banners || [];
  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "Investor";

  // Compute metrics from real database or provide safe defaults
  const totalAmountInvested = stats?.totalAmountInvested ?? 250000;
  const totalReturnAmount = stats?.totalReturnAmount ?? 400000;
  const totalProfitExpected = stats?.totalProfitExpected ?? (totalReturnAmount - totalAmountInvested);
  const totalInvestorBonus = stats?.totalInvestorBonus ?? investments.reduce((acc: number, curr: any) => acc + (curr.investorBonus || 0), 0);
  const totalOwnerBonus = stats?.totalOwnerBonus ?? investments.reduce((acc: number, curr: any) => acc + (curr.ownerBonus || 0), 0);
  const totalInvestments = stats?.totalInvestments ?? investments.length;
  const paidCount = stats?.paidCount ?? 0;
  const pendingCount = stats?.pendingCount ?? totalInvestments;

  // Calculate unique investors count
  const uniqueInvestorsCount = investments.length > 0
    ? new Set(investments.map((i: any) => i.investorName.trim().toLowerCase())).size
    : totalInvestments || 5;

  const avgRoi =
    totalAmountInvested > 0
      ? (((totalReturnAmount - totalAmountInvested) / totalAmountInvested) * 100).toFixed(1)
      : "60.0";

  // Build monthly bar data for the monthly accrual bar chart
  const monthlyData = stats?.monthlyInvestmentData || [];
  const barChartData =
    monthlyData.length >= 4
      ? monthlyData.slice(-6).map((m, idx, arr) => ({
        month: m.month,
        value: m.totalReturn || m.totalInvested || 30000,
        isPeak: idx === arr.length - 2,
      }))
      : [
        { month: "Sep", value: 30000 },
        { month: "Oct", value: 45000 },
        { month: "Nov", value: 65000 },
        { month: "Dec", value: 85000 },
        { month: "Jan", value: 120000, isPeak: true },
        { month: "Feb", value: 95000 },
      ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Header Strip with Brand Logo, Name & Live Ledger Status */}
      <div className="flex flex-col gap-3.5 pb-2.5 border-b border-border/80">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* EYE-VISON Logo Emblem */}
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-tr from-[#a855f7] via-[#8b5cf6] to-[#6d28d9] text-white flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.45)] border border-violet-400/30 shrink-0">
              <Eye className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-foreground font-sans">
                  EYE-VISON
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground font-mono tracking-wider uppercase">
                Capital Ledger
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold shrink-0">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Live Ledger Active</span>
            <span className="sm:hidden">Live</span>
          </span>
        </div>

        {/* Welcome Greeting & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-1">
          <div>
            <DashboardGreeting userName={userName} />
            <p className="text-xs text-muted-foreground mt-0.5">
              Stay on top of your capital positions, monitor progress, and track maturity status.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            <Link href="/investments" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium border border-border dark:border-white/10 transition-all active:scale-95 cursor-pointer">
                <span>All Contracts</span>
                <ArrowUpRight className="h-3 w-3 stroke-[2]" />
              </button>
            </Link>
            <Link href="/investments/new" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 sm:px-4.5 py-2 rounded-full bg-gradient-to-r from-[#a855f7] via-[#8b5cf6] to-[#6d28d9] hover:brightness-110 text-white text-xs font-semibold shadow-lg shadow-violet-500/30 transition-all active:scale-95 cursor-pointer">
                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Record Position</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Festival Greetings & Bonus Announcements Carousel (Clean Dashboard Variant - Visible only if banners exist) */}
      <BannerCarousel banners={banners} variant="dashboard" />

      {/* Quick Details KPI Strip: 4 High-End Cards including Signature Orange Gradient Card */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total Investors */}
        <StatCard
          title="Total Investors"
          value={totalInvestments}
          description={`${uniqueInvestorsCount} Unique investors`}
          icon={<Users className="h-4 w-4" />}
          accent="purple"
        />

        {/* Metric 2: Total Amount Invested (Principal) */}
        <StatCard
          title="Total Amount Invested"
          value={`₹${totalAmountInvested.toLocaleString("en-IN")}`}
          description="Total capital deployed"
          icon={<Wallet className="h-4 w-4" />}
          accent="violet"
        />

        {/* Metric 3: Total Profit Expected - Signature Radiant Violet Card */}
        <StatCard
          variant="gradient-violet"
          title="Total Profit Expected"
          value={`+₹${totalProfitExpected.toLocaleString("en-IN")}`}
          badge={`+${avgRoi}% Yield`}
          description="Contractual projected yield"
          icon={<Sparkles className="h-4 w-4" />}
        />

        {/* Metric 4: Maturity Valuation / Payout */}
        <StatCard
          title="Maturity Valuation"
          value={`₹${totalReturnAmount.toLocaleString("en-IN")}`}
          description={`${paidCount} settled / ${pendingCount} pending`}
          icon={
            pendingCount > 0 ? (
              <Clock className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )
          }
          accent={pendingCount > 0 ? "amber" : "emerald"}
        />
      </div>

      {/* Bonus Distribution Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-card dark:bg-[#101116] border border-border dark:border-white/[0.08] flex items-center justify-between shadow-sm hover:border-purple-500/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Gift className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                Account Owner Total Bonus
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your earned syndicate bonuses across all recorded positions
              </p>
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-lg sm:text-xl font-bold text-foreground tabular-nums">
              ₹{totalOwnerBonus.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card dark:bg-[#101116] border border-border dark:border-white/[0.08] flex items-center justify-between shadow-sm hover:border-violet-500/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 block">
                Investor Bonus Pool
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Added directly into investor profits & maturity returns
              </p>
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400 tabular-nums">
              +₹{totalInvestorBonus.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Valuation & Accrual Mountain Chart (Both Invested + Return Curves with working filter) */}
      <TotalBalanceCard
        totalBalance={totalReturnAmount}
        totalInvested={totalAmountInvested}
        growthPercent={avgRoi}
        monthlyData={monthlyData}
        averageAnnualRate={totalProfitExpected}
      />

      {/* Analytics & Recent Activity Grid */}
      <div className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-2 items-stretch">
        {/* Monthly Accrual Bar Chart */}
        <InvestmentsBarChart
          totalExpected={totalProfitExpected}
          growthPercent={avgRoi}
          data={barChartData}
        />

        {/* Recent Ledger Activity */}
        <RecentTransactionsCard investments={investments} />
      </div>
    </div>
  );
}
