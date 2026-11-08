import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: ReactNode;
  className?: string;
  valueClassName?: string;
  accent?: "violet" | "purple" | "emerald" | "blue" | "amber" | "neutral" | "orange";
  variant?: "default" | "gradient-violet" | "gradient-orange";
  badge?: string;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  className,
  valueClassName,
  accent = "neutral",
  variant = "default",
  badge,
}: StatCardProps) {
  const isGradientViolet = variant === "gradient-violet" || variant === "gradient-orange";

  const accentStyles = {
    neutral: "hover:border-foreground/30",
    violet: "hover:border-violet-500/50",
    orange: "hover:border-violet-500/50",
    emerald: "hover:border-emerald-500/50",
    blue: "hover:border-blue-500/50",
    purple: "hover:border-purple-500/50",
    amber: "hover:border-amber-500/50",
  };

  const iconBgStyles = {
    neutral: "bg-secondary text-muted-foreground border-border",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    orange: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  };

  if (isGradientViolet) {
    return (
      <div
        className={cn(
          "p-3.5 sm:p-5 rounded-2xl violet-gradient-card flex flex-col justify-between transition-all duration-300 group/stat hover:scale-[1.02]",
          className
        )}
      >
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-white/90 truncate">
            {title}
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {badge && (
              <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                {badge}
              </span>
            )}
            {icon && (
              <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-white/20 border border-white/30 text-white flex items-center justify-center transition-transform group-hover/stat:scale-110">
                {icon}
              </div>
            )}
          </div>
        </div>

        <div className="mt-2.5 sm:mt-3.5">
          <div
            className={cn(
              "text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight tabular-nums text-white truncate drop-shadow-xs",
              valueClassName
            )}
          >
            {value}
          </div>
          {description && (
            <div className="text-[10px] sm:text-xs text-white/85 mt-1 sm:mt-1.5 flex items-center gap-1 sm:gap-1.5 font-medium truncate">
              {description}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-3.5 sm:p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between transition-all duration-200 group/stat hover:border-primary/40 dark:hover:border-white/20 hover:shadow-md",
        accentStyles[accent],
        className
      )}
    >
      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
        <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
          {title}
        </span>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {badge && (
            <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {badge}
            </span>
          )}
          {icon && (
            <div
              className={cn(
                "h-6 w-6 sm:h-7 sm:w-7 rounded-lg border flex items-center justify-center transition-transform group-hover/stat:scale-110",
                iconBgStyles[accent]
              )}
            >
              {icon}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2.5 sm:mt-3.5">
        <div
          className={cn(
            "text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight tabular-nums text-foreground truncate",
            valueClassName
          )}
        >
          {value}
        </div>
        {description && (
          <div className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-1.5 flex items-center gap-1 sm:gap-1.5 font-medium truncate">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
