"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart, TrendingUp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart },
    { href: "/investments", label: "Investments", icon: TrendingUp },
    { href: "/investments/new", label: "Add", icon: Plus },
  ];

  const getActiveIndex = () => {
    const currentPath = pathname || "/dashboard";
    if (currentPath === "/dashboard" || currentPath === "/" || currentPath.startsWith("/dashboard/")) return 0;
    if (currentPath.startsWith("/investments/new")) return 2;
    if (currentPath.startsWith("/investments")) return 1;
    return 0;
  };

  const activeIndex = getActiveIndex();

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 w-full flex justify-center px-4 pb-[env(safe-area-inset-bottom)] md:hidden pointer-events-none">
      <nav className="w-full max-w-sm rounded-full border border-border bg-card/60 backdrop-blur-xl shadow-2xl pointer-events-auto overflow-visible">
        <div className="flex h-16 items-center justify-between relative px-2">
          {links.map((link, index) => {
            const isActive = activeIndex === index;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex flex-1 flex-col items-center h-full justify-center group"
              >
                {/* Active Indicator (The Sliding Pill) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute h-14 w-14 bg-foreground rounded-full shadow-xl border border-white/10 z-0"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      style={{ 
                        top: "-24px"
                      }}
                    >
                      {/* Glossy Reflection */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-40" />
                      
                      {/* Subtle Outer Glow */}
                      <div className="absolute inset-[-4px] rounded-full bg-foreground/10 blur-md -z-10" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Icon Container */}
                <motion.div 
                  animate={{
                    y: isActive ? -26 : 0,
                    scale: isActive ? 1.15 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                  className={cn(
                    "z-10 flex items-center justify-center transition-colors duration-300",
                    isActive ? "text-background" : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </motion.div>

                {/* Label */}
                <motion.span 
                  animate={{
                    opacity: isActive ? 1 : 0.5,
                    y: isActive ? 8 : 0,
                    fontWeight: isActive ? 700 : 500,
                  }}
                  className={cn(
                    "absolute bottom-2 text-[9px] tracking-widest uppercase transition-all duration-300",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </motion.span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
