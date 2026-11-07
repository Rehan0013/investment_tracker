"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Plus, Calculator, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Home,
    checkActive: (path: string) => path === "/dashboard" || path === "/",
  },
  {
    href: "/investments",
    label: "Portfolio",
    icon: LayoutGrid,
    checkActive: (path: string) =>
      path === "/investments" || (path.startsWith("/investments/") && path !== "/investments/new"),
  },
  {
    href: "/investments/new",
    label: "Add",
    icon: Plus,
    checkActive: (path: string) => path === "/investments/new",
  },
  {
    href: "/simulator",
    label: "Simulator",
    icon: Calculator,
    checkActive: (path: string) => path === "/simulator",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    checkActive: (path: string) => path.startsWith("/settings"),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  // Determine active tab index among the 5 items
  const activeIndex = NAV_ITEMS.findIndex((item) => item.checkActive(pathname));
  const validIndex = activeIndex >= 0 ? activeIndex : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-card/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] transition-colors select-none">
      <nav className="relative grid grid-cols-5 h-16 max-w-lg mx-auto">
        {/* Sliding Popped-Up Orange Ball Indicator: 20% width across the 5 grid columns */}
        <motion.div
          className="absolute inset-y-0 left-0 pointer-events-none flex items-center justify-center z-10"
          style={{ width: "20%" }}
          animate={{
            x: `${validIndex * 100}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 28,
            mass: 0.8,
          }}
        >
          {/* Popped-up circle: elevated by -12px above the bar */}
          <div className="w-11 h-11 -translate-y-3 rounded-full bg-gradient-to-tr from-orange-500 via-orange-600 to-amber-400 shadow-xl shadow-orange-500/40 ring-4 ring-card flex items-center justify-center" />
        </motion.div>

        {/* The 5 Navigation Items */}
        {NAV_ITEMS.map((item) => {
          const isActive = item.checkActive(pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center h-full z-20"
            >
              <motion.div
                animate={{
                  y: isActive ? -12 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 28,
                }}
                whileTap={{ scale: 0.88 }}
                className="flex flex-col items-center justify-center w-full"
              >
                {/* Icon: pops up with the ball and turns white when active */}
                <div className="w-11 h-11 flex items-center justify-center">
                  <Icon
                    className={cn(
                      "w-4.5 h-4.5 transition-colors duration-200",
                      isActive
                        ? "text-white stroke-[2.5]"
                        : "text-muted-foreground stroke-[1.8] hover:text-foreground"
                    )}
                  />
                </div>

                {/* Text Label: smoothly hides when the item is active and popped up */}
                <motion.span
                  initial={false}
                  animate={{
                    opacity: isActive ? 0 : 1,
                    scale: isActive ? 0.75 : 1,
                    y: isActive ? 4 : 0,
                  }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className={cn(
                    "text-[10px] tracking-tight transition-colors -mt-1.5 pointer-events-none select-none",
                    isActive
                      ? "invisible text-transparent"
                      : "visible text-muted-foreground font-medium"
                  )}
                >
                  {item.label}
                </motion.span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
