import { auth } from "@/lib/auth";
import { Eye } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "./LogoutButton";

export async function Navbar() {
  const session = await auth();

  return (
    <div className="w-full flex justify-center pt-4 px-4 pb-2 z-50 sticky top-0">
      <nav className="w-full max-w-5xl rounded-full border border-border bg-card/50 backdrop-blur-xl shadow-sm">
        <div className="relative flex h-14 items-center justify-between px-4 md:px-6">
          <Link href="/dashboard" className="flex items-center gap-3 group z-10">
            <div className="relative w-7 h-7 bg-foreground text-background rounded-full flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
              <Eye className="w-4 h-4" />
            </div>
            <span className="font-semibold tracking-[0.2em] text-sm text-foreground">EYEVISION</span>
          </Link>

          <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-8 text-xs font-semibold tracking-widest uppercase pointer-events-auto">
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link href="/investments" className="text-muted-foreground hover:text-foreground transition-colors">Investments</Link>
              <Link href="/investments/new" className="text-muted-foreground hover:text-foreground transition-colors">Add</Link>
              <Link href="/settings" className="text-muted-foreground hover:text-foreground transition-colors">Settings</Link>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 z-10">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </nav>
    </div>
  );
}
