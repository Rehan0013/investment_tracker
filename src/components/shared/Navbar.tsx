import { auth } from "@/lib/auth";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "./LogoutButton";
import { NavLinks } from "./NavLinks";
import { Eye } from "lucide-react";

export async function Navbar() {
  const session = await auth();
  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "Investor";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-13 flex items-center justify-between gap-4">
        {/* Brand Mark */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Eye className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-foreground leading-none">
                Eye-Vision
              </span>
              <span className="text-[10px] text-muted-foreground font-mono leading-none mt-0.5">
                Private Ledger
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center">
            <NavLinks />
          </div>
        </div>

        {/* Right Section: User & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1 rounded-md bg-secondary/60 border border-border/60 text-xs">
            <div className="h-5 w-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
              {userInitial}
            </div>
            <span className="font-medium text-foreground">{userName}</span>
          </div>

          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
