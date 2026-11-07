"use client";

import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Sun, Moon, Laptop, LogOut, ChevronRight, Database, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SettingsClientProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function SettingsClient({ user }: SettingsClientProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  if (!mounted) return null;

  const displayName = user.name || user.email?.split("@")[0] || "Investor";
  const email = user.email || "adnan@investment.com";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Account Section */}
      <Card className="p-5">
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground font-semibold text-base">
              {initials}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">{displayName}</h2>
              <p className="text-xs text-muted-foreground font-mono">{email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-[11px] font-medium text-muted-foreground border border-border">
            <Shield className="h-3 w-3 text-emerald-600" />
            Authenticated
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>Active Session ID: Private Investment Manager</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-xs gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            {isLoggingOut ? "Ending Session..." : "Sign Out"}
          </Button>
        </div>
      </Card>

      {/* Interface Theme Section */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Color Theme</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select your preferred visual scheme for charts and ledgers
            </p>
          </div>

          <div className="flex items-center gap-1 bg-secondary p-1 rounded-lg border border-border">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                theme === "light"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
              Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                theme === "dark"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Moon className="h-3.5 w-3.5" />
              Dark
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                theme === "system"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Laptop className="h-3.5 w-3.5" />
              Auto
            </button>
          </div>
        </div>
      </Card>

      {/* Operations & Ledger Management Link */}
      <Link href="/settings/manage" className="block group">
        <Card className="p-5 hover:border-foreground/30 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Database className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Ledger Records & Data Management
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Inspect, batch modify, or remove investment records and client accounts
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
          </div>
        </Card>
      </Link>
    </div>
  );
}
