"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden md:inline tracking-widest uppercase text-xs font-semibold">Logout</span>
    </Button>
  );
}
