"use client";

import { useTransition, useState } from "react";
import { loginAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowRight, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await loginAction(formData);
      if (res?.error) {
        setError(res.error);
        toast.error(res.error);
      } else if (res?.success) {
        toast.success("Authentication successful");
        try {
          sessionStorage.setItem("eyevision_trigger_bootup", "true");
          sessionStorage.removeItem("eyevision_boot_consumed");
        } catch (e) {}
        window.location.href = "/dashboard";
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground selection:bg-[#8b5cf6] selection:text-white relative overflow-hidden">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Ambient Horizon Glow Arc in Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-72 bg-gradient-to-b from-[#8b5cf6]/15 dark:from-[#8b5cf6]/20 via-[#8b5cf6]/5 to-transparent blur-3xl pointer-events-none rounded-b-[100%]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-px bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent shadow-[0_0_20px_#8b5cf6]" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/" className="group flex flex-col items-center">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#a855f7] via-[#8b5cf6] to-[#6d28d9] text-white flex items-center justify-center shadow-[0_0_25px_rgba(139,92,246,0.45)] group-hover:scale-105 transition-transform">
              <Eye className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground mt-3">
              Eye-Vision
            </h1>
            <p className="text-xs text-muted-foreground font-mono tracking-wider uppercase mt-0.5">
              Syndicate Portfolio & Ledger
            </p>
          </Link>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-border dark:border-white/[0.1] bg-card dark:bg-[#101116] p-7 shadow-xl space-y-6 transition-colors">
          <div className="space-y-1.5 text-left border-b border-border/80 dark:border-white/[0.06] pb-4">
            <h2 className="text-base font-bold text-foreground flex items-center justify-between">
              <span>Sign In to Syndicate Desk</span>
              <span className="text-[10px] font-mono text-[#8b5cf6] bg-[#8b5cf6]/10 px-2 py-0.5 rounded-full border border-[#8b5cf6]/20 font-semibold">
                Encrypted
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Enter your credentials to access your private investment ledger.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="investor@eyevision.com"
                required
                autoComplete="email"
                className="h-10 text-xs bg-secondary/60 dark:bg-white/[0.04] border-border dark:border-white/[0.1] text-foreground placeholder:text-muted-foreground rounded-xl focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-foreground">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="h-10 text-xs font-mono bg-secondary/60 dark:bg-white/[0.04] border-border dark:border-white/[0.1] text-foreground placeholder:text-muted-foreground rounded-xl pr-10 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 stroke-[1.8]" />
                  ) : (
                    <Eye className="w-4 h-4 stroke-[1.8]" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-full bg-gradient-to-r from-[#a855f7] via-[#8b5cf6] to-[#6d28d9] hover:brightness-110 text-white text-xs font-bold shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all hover:scale-[1.02] gap-2 mt-2"
              disabled={isPending}
            >
              {isPending ? "Authenticating Desk..." : "Access Portfolio Ledger"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Security Footer */}
        <div className="text-center space-y-2">
          <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5 font-mono">
            <Lock className="h-3 w-3 text-[#8b5cf6]" /> Encrypted Session • Mongoose & NextAuth
          </p>
          <div className="text-[11px] text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors underline decoration-border">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
