"use client";

import { useTransition, useState } from "react";
import { loginAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowRight, Lock, Eye } from "lucide-react";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        window.location.href = "/dashboard";
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm space-y-4">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
            <Eye className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              InvestTracker
            </h1>
            <p className="text-xs text-muted-foreground">
              Institutional Private Portfolio & Return Ledger
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="p-6 border-border shadow-xs">
          <CardHeader className="p-0 pb-4 text-left">
            <CardTitle className="text-sm font-semibold text-foreground">
              Sign In to Portfolio
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@investment.com"
                  required
                  autoComplete="email"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium text-foreground">
                    Password
                  </Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="h-9 text-xs font-mono"
                />
              </div>

              {error && (
                <div className="p-2.5 rounded-md bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-9 gap-2 text-xs font-medium" disabled={isPending}>
                {isPending ? "Authenticating..." : "Access Ledger"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Footer */}
        <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5 font-mono">
          <Lock className="h-3 w-3" /> Encrypted Session • Mongoose & NextAuth
        </p>
      </div>
    </div>
  );
}
