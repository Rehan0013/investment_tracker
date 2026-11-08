"use client";

import { useState, useEffect } from "react";
import { BootupScreen } from "@/components/shared/BootupScreen";

export function HomeBootupWrapper() {
  // Synchronous initialization on frame 0 to prevent any pre-hydration flash
  const [shouldBoot, setShouldBoot] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const hasTrigger = sessionStorage.getItem("eyevision_home_trigger") === "true";
        return hasTrigger;
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    try {
      if (shouldBoot) {
        sessionStorage.removeItem("eyevision_home_trigger");
      } else {
        document.documentElement.classList.remove("eyevision-booting");
      }
    } catch (e) {
      document.documentElement.classList.remove("eyevision-booting");
    }
  }, [shouldBoot]);

  if (!shouldBoot) return null;

  return (
    <BootupScreen
      mode="web"
      forceShow={true}
      minDuration={1300}
      onComplete={() => {
        try {
          sessionStorage.removeItem("eyevision_home_trigger");
          document.documentElement.classList.remove("eyevision-booting");
        } catch (e) {}
        setShouldBoot(false);
      }}
    />
  );
}

