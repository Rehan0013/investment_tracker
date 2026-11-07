"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Eye,
  Home,
  LayoutGrid,
  PlusCircle,
  Calculator,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarRailProps {
  className?: string;
}

export function SidebarRail({ className }: SidebarRailProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard Overview",
      icon: Home,
      isActive: pathname === "/dashboard",
    },
    {
      href: "/investments",
      label: "Portfolio Positions",
      icon: LayoutGrid,
      isActive: pathname === "/investments" || (pathname.startsWith("/investments/") && pathname !== "/investments/new"),
    },
    {
      href: "/investments/new",
      label: "Record Position",
      icon: PlusCircle,
      isActive: pathname === "/investments/new",
    },
    {
      href: "/simulator",
      label: "ROI Simulator",
      icon: Calculator,
      isActive: pathname === "/simulator",
    },
  ];

  const isSettingsActive = pathname.startsWith("/settings");

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col items-center justify-between py-6 px-3 w-[76px] h-screen sticky top-0 bg-card border-r border-border z-50 select-none transition-colors",
        className
      )}
    >
      {/* Top: Eye Brand Logo */}
      <div className="flex flex-col items-center gap-6">
        <Link
          href="/dashboard"
          className="group relative flex items-center justify-center h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          title="InvestTracker Private Ledger"
        >
          <Eye className="w-5 h-5 stroke-[2.2] transition-transform group-hover:scale-110" />
        </Link>

        {/* Navigation Icon Stack */}
        <nav className="flex flex-col items-center gap-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative flex items-center justify-center h-11 w-11 rounded-2xl transition-all duration-150 group",
                  item.isActive
                    ? "bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/25 scale-100 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary active:scale-95"
                )}
                title={item.label}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform group-hover:scale-105",
                    item.isActive ? "stroke-[2.2]" : "stroke-[1.8]"
                  )}
                />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Settings & Logout */}
      <div className="flex flex-col items-center gap-2.5 pt-4 border-t border-border">
        <Link
          href="/settings"
          className={cn(
            "flex items-center justify-center h-11 w-11 rounded-2xl transition-all duration-150",
            isSettingsActive
              ? "bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/25 font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary active:scale-95"
          )}
          title="Account & System Settings"
        >
          <Settings className="w-5 h-5 stroke-[1.8]" />
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center justify-center h-11 w-11 rounded-2xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-150 active:scale-95 cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5 stroke-[1.8]" />
        </button>
      </div>
    </aside>
  );
}
