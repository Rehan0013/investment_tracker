"use client";

import { useState, useEffect } from "react";

interface DashboardGreetingProps {
  userName: string;
  className?: string;
}

export function DashboardGreeting({ userName, className }: DashboardGreetingProps) {
  // Determine greeting based on user's local browser clock
  const getLocalGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) {
      return "morning";
    } else if (hour >= 12 && hour < 17) {
      return "afternoon";
    } else {
      return "evening";
    }
  };

  const [greeting, setGreeting] = useState<string>("morning");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setGreeting(getLocalGreeting());
    setMounted(true);

    // Update greeting every 30 seconds if tab is kept open
    const interval = setInterval(() => {
      setGreeting(getLocalGreeting());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Format name nicely (capitalize first letter of each part)
  const formattedName = userName
    ? userName
      .trim()
      .split(/[.\s_-]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ")
    : "Investor";

  return (
    <h1
      className={
        className ||
        "text-xl sm:text-2xl font-bold tracking-tight text-foreground"
      }
    >
      Good {mounted ? greeting : getLocalGreeting()}, 👋 {formattedName}
    </h1>
  );
}

