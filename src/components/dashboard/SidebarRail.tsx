"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
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

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard Overview",
    icon: Home,
    checkActive: (path: string) => path === "/dashboard" || path === "/",
  },
  {
    href: "/investments",
    label: "Portfolio Positions",
    icon: LayoutGrid,
    checkActive: (path: string) =>
      path === "/investments" || (path.startsWith("/investments/") && path !== "/investments/new"),
  },
  {
    href: "/investments/new",
    label: "Record Position",
    icon: PlusCircle,
    checkActive: (path: string) => path === "/investments/new",
  },
  {
    href: "/simulator",
    label: "ROI Simulator",
    icon: Calculator,
    checkActive: (path: string) => path === "/simulator",
  },
  {
    href: "/settings",
    label: "System Settings",
    icon: Settings,
    checkActive: (path: string) => path.startsWith("/settings"),
  },
];

export function SidebarRail({ className }: SidebarRailProps) {
  const pathname = usePathname();

  // Active tab index matching the current route
  const activeIndex = NAV_ITEMS.findIndex((item) => item.checkActive(pathname));
  const validIndex = activeIndex >= 0 ? activeIndex : 0;

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col items-center justify-between py-6 px-3 w-[76px] h-screen sticky top-0 bg-card dark:bg-[#0c0d12] border-r border-border dark:border-white/[0.08] z-50 select-none transition-colors",
        className
      )}
    >
      {/* Top: Eye Brand Logo + Nav Stack */}
      <div className="flex flex-col items-center gap-6 w-full">
        <Link
          href="/dashboard"
          className="group relative flex items-center justify-center h-11 w-11 rounded-2xl bg-gradient-to-tr from-[#ff6b35] to-[#ff5722] text-white hover:scale-105 transition-all shadow-[0_0_24px_rgba(255,87,34,0.45)]"
          title="Eye-Vision Private Ledger"
        >
          <Eye className="w-5 h-5 stroke-[2.2] transition-transform group-hover:scale-110" />
        </Link>

        {/* Navigation Icon Stack with Sliding Orange Circle */}
        <nav className="relative flex flex-col items-center gap-2.5 w-full">
          {/* Sliding Orange Circle Indicator: animates smoothly between items with spring physics */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-11 h-11 pointer-events-none z-10 flex items-center justify-center"
            initial={false}
            animate={{
              y: validIndex * 54,
              opacity: activeIndex >= 0 ? 1 : 0,
              scale: activeIndex >= 0 ? 1 : 0.8,
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 28,
              mass: 0.8,
            }}
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-orange-500 via-orange-600 to-amber-400 shadow-xl shadow-orange-500/40 ring-2 ring-card/80" />
          </motion.div>

          {/* Navigation Links */}
          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = idx === activeIndex;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex items-center justify-center h-11 w-11 rounded-full z-20 group"
                title={item.label}
              >
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center w-full h-full"
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors duration-200",
                      isActive
                        ? "text-white stroke-[2.2]"
                        : "text-muted-foreground stroke-[1.8] group-hover:text-foreground"
                    )}
                  />
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Sign Out Action */}
      <div className="flex flex-col items-center pt-4 border-t border-border w-full">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center justify-center h-11 w-11 rounded-2xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-150 active:scale-95 cursor-pointer group"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5 stroke-[1.8] transition-transform group-hover:scale-105" />
        </button>
      </div>
    </aside>
  );
}
