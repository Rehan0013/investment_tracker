"use client";

import { useState, useEffect } from "react";
import { BootupScreen } from "@/components/shared/BootupScreen";

export function DashboardBootupWrapper() {
  // Synchronous initialization to eliminate any flash of the dashboard before animation mounts
  const [shouldBoot, setShouldBoot] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const hasTrigger = sessionStorage.getItem("eyevision_trigger_bootup") === "true";
        const consumed = sessionStorage.getItem("eyevision_boot_consumed") === "true";

        let isFromLandingOrLogin = false;
        if (typeof document !== "undefined" && document.referrer) {
          try {
            const refUrl = new URL(document.referrer);
            if (refUrl.origin === window.location.origin) {
              const path = refUrl.pathname;
              if (path === "/" || path === "" || path.startsWith("/login")) {
                isFromLandingOrLogin = true;
              }
            }
          } catch (e) {}
        }

        return (hasTrigger || isFromLandingOrLogin) && !consumed;
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    try {
      if (shouldBoot) {
        sessionStorage.setItem("eyevision_boot_consumed", "true");
        sessionStorage.removeItem("eyevision_trigger_bootup");
      } else {
        // Not booting - remove the pre-paint blocker class immediately
        sessionStorage.removeItem("eyevision_trigger_bootup");
        document.documentElement.classList.remove("eyevision-booting");
      }
    } catch (e) {
      document.documentElement.classList.remove("eyevision-booting");
    }
  }, [shouldBoot]);

  if (!shouldBoot) return null;

  return (
    <BootupScreen
      mode="dashboard"
      forceShow={true}
      minDuration={1250}
      onComplete={() => {
        try {
          sessionStorage.removeItem("eyevision_trigger_bootup");
          document.documentElement.classList.remove("eyevision-booting");
        } catch (e) {}
        setShouldBoot(false);
      }}
    />
  );
}
