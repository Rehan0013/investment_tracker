import { getDashboardStats, getInvestments } from "@/actions/investment.actions";
import { StatCard } from "@/components/dashboard/StatCard";
import { OverallChart } from "@/components/dashboard/OverallChart";
import { RecentInvestments } from "@/components/dashboard/RecentInvestments";
import { Users, TrendingUp, IndianRupee, Wallet, Activity, BarChart3, ShieldCheck, Percent } from "lucide-react";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const [statsRes, investmentsRes, session] = await Promise.all([
    getDashboardStats(),
    getInvestments(),
    auth(),
  ]);

  const stats = statsRes.success ? statsRes.stats : null;
  const recentInvestments = investmentsRes.success ? investmentsRes.investments.slice(0, 5) : [];
  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || "Investor";

  if (!stats) {
    return <div className="p-4">Failed to load dashboard data.</div>;
  }

  return (
    <div className="container p-4 pt-6 md:pt-8 space-y-6">
      <div className="flex flex-col gap-1 z-10 relative">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Hello 👋, {userName}</h1>
        <h1 className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Dashboard</h1>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <StatCard
          title="Total Investors"
          value={stats.totalInvestments}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Total Invested Amount"
          value={`₹${stats.totalAmountInvested.toLocaleString('en-IN')}`}
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatCard
          title="Total Profit Expected"
          value={`₹${stats.totalProfitExpected.toLocaleString('en-IN')}`}
          icon={<IndianRupee className="h-4 w-4 text-success" />}
          description={<span className="text-success flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> +{stats.totalAmountInvested > 0 ? (((stats.totalReturnAmount - stats.totalAmountInvested) / stats.totalAmountInvested) * 100).toFixed(1) : "50"}% ROI</span>}
        />
      </div>

      {(() => {
        const avgRoi = stats.totalAmountInvested > 0
          ? (((stats.totalReturnAmount - stats.totalAmountInvested) / stats.totalAmountInvested) * 100).toFixed(1)
          : "0.0";
        const completionRate = stats.totalInvestments > 0
          ? ((stats.paidCount / stats.totalInvestments) * 100).toFixed(0)
          : "0";

        return (
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
            <StatCard
              title="Active Investments"
              value={stats.pendingCount}
              valueClassName="text-primary font-mono font-bold text-2xl"
              icon={<Activity className="h-4 w-4 text-primary" />}
              description="Currently generating returns"
            />
            <StatCard
              title="Settled Payouts"
              value={stats.paidCount}
              valueClassName="text-success font-mono font-bold text-2xl"
              icon={<ShieldCheck className="h-4 w-4 text-success" />}
              description="Fully matured & transferred"
            />
            <StatCard
              title="Average Yield"
              value={`+${avgRoi}%`}
              valueClassName="text-success font-mono font-bold text-2xl"
              icon={<TrendingUp className="h-4 w-4 text-success" />}
              description="Portfolio projected ROI"
            />
            <StatCard
              title="Completion Rate"
              value={`${completionRate}%`}
              valueClassName="text-foreground font-mono font-bold text-2xl"
              icon={<Percent className="h-4 w-4 text-primary" />}
              description="Investments successfully paid"
            />
          </div>
        );
      })()}

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <OverallChart data={stats.monthlyInvestmentData} />
        <RecentInvestments investments={recentInvestments} />
      </div>
    </div>
  );
}
