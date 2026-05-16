"use client";

import { useEffect, useState } from "react";
import { getInvestments } from "@/actions/investment.actions";
import { InvestmentCard } from "@/components/investments/InvestmentCard";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Paid">("All");

  useEffect(() => {
    async function load() {
      const res = await getInvestments();
      if (res.success) setInvestments(res.investments);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = investments.filter(inv => {
    const matchesSearch = inv.investorName.toLowerCase().includes(search.toLowerCase()) || 
                          inv.mobileNo.includes(search);
    if (!matchesSearch) return false;
    
    if (filter === "Paid") return inv.isPaid;
    if (filter === "Active") return !inv.isPaid;
    return true;
  });

  return (
    <div className="container p-4 pt-6 md:pt-8 space-y-6 relative min-h-[calc(100vh-4rem)] pb-20">
      <div className="flex flex-col gap-1 z-10 relative">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Investments</h1>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Liquid Institutional Portfolio Management</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center w-full">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search by name or mobile..." 
            className="pl-10 bg-card border-border focus-visible:ring-1 focus-visible:ring-ring text-foreground placeholder:text-muted-foreground h-10 rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 bg-card p-1 rounded-lg border border-border w-full sm:w-fit overflow-x-auto no-scrollbar">
          {(["All", "Active", "Paid"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-md transition-colors whitespace-nowrap ${filter === tab ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl bg-surface" />
          ))
        ) : filtered.length > 0 ? (
          filtered.map(inv => (
            <InvestmentCard key={inv._id} investment={inv} />
          ))
        ) : (
          <div className="col-span-full py-16 text-center flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-card/50">
            <p className="text-muted-foreground font-medium tracking-wide">No investments found.</p>
          </div>
        )}
      </div>

      <Link href="/investments/new" className="fixed bottom-20 right-4 md:bottom-6 md:right-6 hidden md:flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg hover:bg-foreground/90 transition-transform hover:scale-105 z-50">
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}
