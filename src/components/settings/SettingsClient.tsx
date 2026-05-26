"use client";

import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Sun, Moon, LogOut, ChevronRight, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

  const displayName = user.name || user.email?.split("@")[0] || "User";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      {/* User Profile & Dark Mode Card */}
      <Card className="border border-border/60 bg-card/60 dark:bg-card/40 backdrop-blur-2xl shadow-2xl">
        <CardContent className="p-6 space-y-6">
          
          {/* User Info Header */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-success text-2xl font-bold font-sans">
              {initials}
            </div>
            <div className="space-y-0.5">
              <h2 className="text-xl font-bold uppercase tracking-wide text-foreground font-sans">
                {displayName}
              </h2>
              <p className="text-xs text-muted-foreground font-medium font-sans">
                System Administrator
              </p>
            </div>
          </div>

          <div className="h-px bg-border/40 w-full" />

          {/* Dark Mode Toggle Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold tracking-wider text-foreground uppercase font-sans">
                Dark Mode
              </h3>
              <p className="text-xs text-muted-foreground font-sans">
                Toggle visual interface colors
              </p>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border border-border/60 bg-background/50 hover:bg-muted/50 transition-colors shadow-sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-foreground animate-pulse" />
              ) : (
                <Moon className="h-5 w-5 text-foreground" />
              )}
            </Button>
          </div>

          {/* Log Out Button */}
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full h-14 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 font-bold rounded-2xl transition-all duration-300 gap-3 shadow-md shadow-rose-950/5"
          >
            <LogOut className="h-5 w-5 rotate-180" />
            <span className="tracking-widest uppercase text-sm font-sans">
              {isLoggingOut ? "LOGGING OUT..." : "LOG OUT SESSION"}
            </span>
          </Button>

        </CardContent>
      </Card>

      {/* Operations Navigation Card */}
      <Link href="/settings/manage" className="block group">
        <Card className="border border-border/60 bg-card/60 dark:bg-card/40 backdrop-blur-2xl hover:border-primary/40 transition-all duration-300 shadow-2xl cursor-pointer">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center text-success group-hover:scale-105 transition-transform">
                <UserCog className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-foreground text-sm tracking-wide font-sans">
                  Manage Investments
                </h3>
                <p className="text-xs text-muted-foreground font-sans">
                  Search, Edit, or Delete Investments
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
