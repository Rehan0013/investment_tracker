"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Eye, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BootupScreenProps {
  mode?: "web" | "dashboard";
  storageKey?: string;
  forceShow?: boolean;
  minDuration?: number;
  onComplete?: () => void;
  className?: string;
}

const DASHBOARD_STEPS = [
  { threshold: 0, text: "Initializing cryptographic session..." },
  { threshold: 25, text: "Decrypting private investment ledger..." },
  { threshold: 55, text: "Calculating contractual ROI & bonuses..." },
  { threshold: 82, text: "Synchronizing live portfolio valuation..." },
  { threshold: 100, text: "Decryption verified. Ready." },
];

const WEB_STEPS = [
  { threshold: 0, text: "Connecting to Eye-Vision network..." },
  { threshold: 30, text: "Loading private syndicate architecture..." },
  { threshold: 65, text: "Synchronizing institutional yield models..." },
  { threshold: 90, text: "Preparing secure financial environment..." },
  { threshold: 100, text: "System online. Welcome." },
];

export function BootupScreen({
  mode = "dashboard",
  storageKey,
  forceShow = false,
  minDuration = 1400,
  onComplete,
  className,
}: BootupScreenProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState<boolean>(() => forceShow);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>(() => (mode === "dashboard" ? DASHBOARD_STEPS[0].text : WEB_STEPS[0].text));
  const isFinishedRef = useRef(false);

  const steps = mode === "dashboard" ? DASHBOARD_STEPS : WEB_STEPS;

  // Check storage key on mount to see if bootup animation should be triggered
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!forceShow && storageKey) {
      try {
        const alreadyBooted = sessionStorage.getItem(storageKey);
        if (alreadyBooted === "true") {
          setIsVisible(false);
          onComplete?.();
          return;
        }
      } catch (e) {
        // Fallback if sessionStorage is disabled
      }
    }

    setIsVisible(true);
    setStatusText(steps[0].text);
  }, [storageKey, forceShow, onComplete]);

  // Smooth progress ticker
  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const intervalTime = 30; // 30ms step updates
    const totalDuration = shouldReduceMotion ? 400 : Math.max(800, minDuration);

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawRatio = Math.min(1, elapsed / totalDuration);

      // Smooth ease-out cubic curve for progress acceleration
      const easeProgress = Math.round(
        (1 - Math.pow(1 - rawRatio, 2.5)) * 100
      );

      setProgress(easeProgress);

      // Match status text based on progress thresholds
      const currentStep = [...steps]
        .reverse()
        .find((s) => easeProgress >= s.threshold);
      if (currentStep) {
        setStatusText(currentStep.text);
      }

      if (rawRatio >= 1) {
        clearInterval(interval);
        if (!isFinishedRef.current) {
          isFinishedRef.current = true;
          // Hold briefly at 100% so the user registers "Ready"
          setTimeout(() => {
            setIsVisible(false);
            if (storageKey) {
              try {
                sessionStorage.setItem(storageKey, "true");
              } catch (e) {}
            }
            onComplete?.();
          }, shouldReduceMotion ? 100 : 250);
        }
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isVisible, minDuration, shouldReduceMotion, storageKey, onComplete, steps]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="eyevision-bootup-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: shouldReduceMotion ? 1 : 1.025,
            filter: shouldReduceMotion ? "none" : "blur(10px)",
          }}
          transition={{
            duration: shouldReduceMotion ? 0.2 : 0.45,
            ease: [0.23, 1, 0.32, 1], // Emil Kowalski / Apple strong ease-out
          }}
          className={cn(
            "fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden",
            // Dark luxury obsidian backdrop matching app dark mode theme
            "bg-[#07080b] text-white",
            className
          )}
        >
          {/* Ambient Radiant Violet Glow in Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[340px] bg-[#8b5cf6]/20 blur-[140px] rounded-full pointer-events-none" />

          {/* Top Radiant Horizon Glow Arc */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-36 bg-gradient-to-b from-[#8b5cf6]/25 via-[#8b5cf6]/5 to-transparent blur-3xl pointer-events-none rounded-b-[100%]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] h-px bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent shadow-[0_0_24px_#8b5cf6]" />

          {/* Center Stage Card Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-sm w-full space-y-7">
            {/* Eye-Vision Radiant Logo Badge */}
            <div className="relative group">
              {/* Outer pulsing ambient ring */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        scale: [1, 1.15, 1],
                        opacity: [0.45, 0.75, 0.45],
                      }
                }
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-3 rounded-[32px] bg-gradient-to-tr from-[#a855f7]/40 via-[#8b5cf6]/30 to-[#6d28d9]/40 blur-xl pointer-events-none"
              />

              {/* The Signature Squircle Badge */}
              <motion.div
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.9, y: 12 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  mass: 0.8,
                }}
                className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-gradient-to-tr from-[#a855f7] via-[#8b5cf6] to-[#6d28d9] p-0.5 shadow-[0_0_40px_rgba(139,92,246,0.5)] flex items-center justify-center ring-1 ring-white/20"
              >
                <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-[#8b5cf6] via-[#7c3aed] to-[#5b21b6] flex items-center justify-center shadow-inner">
                  <Eye className="w-10 h-10 sm:w-12 sm:h-12 text-white stroke-[2.2] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" />
                </div>
              </motion.div>
            </div>

            {/* Brand Title & Subtitle */}
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 8 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="space-y-1.5"
            >
              <h1 className="text-2xl sm:text-3xl font-black tracking-[0.22em] text-white uppercase drop-shadow-md">
                Eye-Vision
              </h1>
              <p className="text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
                {mode === "dashboard"
                  ? "Syndicate Portfolio & Ledger Desk"
                  : "Syndicate Capital & Private Ledger"}
              </p>
            </motion.div>

            {/* Loading Bar & Progress Metrics */}
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 8 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.4 }}
              className="w-full space-y-2.5 pt-2"
            >
              {/* The Glowing Linear Progress Bar Track */}
              <div className="w-full h-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] overflow-hidden relative shadow-inner">
                {/* Active Progress Fill */}
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#a855f7] via-[#8b5cf6] to-[#c084fc] shadow-[0_0_12px_#8b5cf6]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.1 }}
                />

                {/* Shimmer Light Reflection Sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite] pointer-events-none" />
              </div>

              {/* Progress Labels: Status Text on Left, Percentage on Right */}
              <div className="flex items-center justify-between text-[11px] font-mono px-0.5">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-pulse" />
                  <span className="truncate max-w-[220px]">{statusText}</span>
                </div>
                <span className="font-bold text-violet-400 tabular-nums">
                  {progress}%
                </span>
              </div>
            </motion.div>

            {/* Bottom Institutional Security Pill */}
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0 }
              }
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28, duration: 0.5 }}
              className="pt-4"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-zinc-400 shadow-xs">
                <Lock className="w-2.5 h-2.5 text-[#8b5cf6]" />
                <span>256-Bit Encrypted Environment</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

