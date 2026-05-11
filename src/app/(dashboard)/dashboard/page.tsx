import { getDashboardStats, getInvestments } from "@/actions/investment.actions";
import { StatCard } from "@/components/dashboard/StatCard";
import { OverallChart } from "@/components/dashboard/OverallChart";
import { RecentInvestments } from "@/components/dashboard/RecentInvestments";
import { Users, TrendingUp, IndianRupee, Wallet } from "lucide-react";

export default async function DashboardPage() {
  const [statsRes, investmentsRes] = await Promise.all([
    getDashboardStats(),
    getInvestments(),
  ]);

  const stats = statsRes.success ? statsRes.stats : null;
  const recentInvestments = investmentsRes.success ? investmentsRes.investments.slice(0, 5) : [];

  if (!stats) {
    return <div className="p-4">Failed to load dashboard data.</div>;
  }

  return (
    <div className="container p-4 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

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
          description={<span className="text-success flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> +50% ROI</span>}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <OverallChart data={stats.monthlyInvestmentData} />
        <RecentInvestments investments={recentInvestments} />
      </div>
    </div>
  );
}
