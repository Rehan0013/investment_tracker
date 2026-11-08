"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Search,
  RotateCw,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  Settings,
  LogOut,
  LayoutGrid,
  SlidersHorizontal,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { useTheme } from "next-themes";

interface TopHeaderProps {
  userName?: string;
  userEmail?: string;
}

export function TopHeader({ userName = "Adnan Khan", userEmail = "adnan@investment.com" }: TopHeaderProps) {
  const router = useRouter();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/investments?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleToggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const userHandle = `@${userEmail.split("@")[0] || "investor"}`;

  return (
    <header className="w-full flex items-center justify-between gap-2.5 sm:gap-4 py-2.5 sm:py-3.5 px-3 sm:px-6 lg:px-8 border-b border-border dark:border-white/[0.08] bg-card/90 dark:bg-[#0c0d12]/90 backdrop-blur-xl sticky top-0 z-40 select-none transition-colors">
      {/* Mobile Brand Logo & Name (visible when sidebar is hidden on small screens) */}
      {/* <Link
        href="/dashboard"
        className="flex md:hidden items-center gap-2 mr-1 sm:mr-2 shrink-0 group"
      >
        <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#a855f7] via-[#8b5cf6] to-[#6d28d9] text-white flex items-center justify-center shadow-md shadow-violet-500/30">
          <Eye className="w-4 h-4 stroke-[2.2]" />
        </div>
        <span className="font-extrabold text-xs tracking-tight text-foreground uppercase hidden xs:inline">
          EYE-VISON
        </span>
      </Link> */}

      {/* Left: Search Bar Pill */}
      <form
        onSubmit={handleSearchSubmit}
        className={`relative flex items-center w-full max-w-md h-9 sm:h-10 px-3.5 sm:px-4 rounded-full bg-secondary/60 dark:bg-white/[0.04] border transition-all duration-200 ${isSearchFocused
          ? "border-primary ring-2 ring-primary/15 shadow-sm"
          : "border-border dark:border-white/10 hover:border-primary/40 dark:hover:border-white/20"
          }`}
      >
        <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground mr-1.5 sm:mr-2 shrink-0 stroke-[1.8]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          placeholder="Search contracts, investors..."
          className="w-full bg-transparent text-xs sm:text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </form>

      {/* Right Controls: Refresh, Theme Toggle, Profile Dropdown */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="flex items-center justify-center h-8.5 w-8.5 sm:h-9 sm:w-9 rounded-full bg-secondary dark:bg-white/[0.04] border border-border dark:border-white/10 text-muted-foreground hover:text-foreground hover:bg-secondary/80 dark:hover:bg-white/[0.08] transition-all active:scale-95 cursor-pointer"
          title="Refresh Data"
        >
          <RotateCw
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8] ${isRefreshing ? "animate-spin text-primary" : ""}`}
          />
        </button>

        {/* Theme Toggle (Moon / Sun) */}
        <button
          onClick={handleToggleTheme}
          className="flex items-center justify-center h-8.5 w-8.5 sm:h-9 sm:w-9 rounded-full bg-secondary dark:bg-white/[0.04] border border-border dark:border-white/10 text-muted-foreground hover:text-foreground hover:bg-secondary/80 dark:hover:bg-white/[0.08] transition-all active:scale-95 cursor-pointer"
          title="Toggle Light/Dark Theme"
        >
          {!isDark ? (
            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 stroke-[1.8]" />
          ) : (
            <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400 stroke-[1.8]" />
          )}
        </button>

        {/* User Profile Pill with Pop-up Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2.5 pl-1 sm:pl-1.5 pr-2 sm:pr-3 py-1 rounded-full bg-secondary dark:bg-white/[0.04] border border-border dark:border-white/10 hover:border-primary/40 dark:hover:border-white/20 transition-all group cursor-pointer"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            {/* Avatar with emerald online badge */}
            <div className="relative">
              <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-violet-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-bold shadow-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-secondary" />
            </div>

            {/* Name & Handle */}
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                {userName}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono leading-tight">
                {userHandle}
              </span>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-transform stroke-[2] ${isDropdownOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {/* Pop-up Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-popover text-popover-foreground border border-border shadow-xl p-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
              {/* User Details Header */}
              <div className="px-3 py-2.5 border-b border-border/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {userName}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate font-mono">
                    {userEmail}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Private Ledger</span>
                  </div>
                </div>
              </div>

              {/* Navigation Options */}
              <div className="py-1.5 space-y-0.5">
                <Link
                  href="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span>Account & System Settings</span>
                </Link>

                <Link
                  href="/settings/manage"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                  <span>Manage Portfolio Ledger</span>
                </Link>

                <Link
                  href="/investments"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors"
                >
                  <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                  <span>View All Positions</span>
                </Link>
              </div>

              {/* Divider & Sign Out */}
              <div className="pt-1 border-t border-border/80">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    signOut({ callbackUrl: "/login" });
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
