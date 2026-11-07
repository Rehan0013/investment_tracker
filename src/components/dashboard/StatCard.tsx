import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: ReactNode;
  className?: string;
  valueClassName?: string;
  accent?: "orange" | "emerald" | "blue" | "purple" | "amber" | "neutral";
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
  badge,
}: StatCardProps) {
  const accentStyles = {
    neutral: "hover:border-foreground/30",
    orange: "hover:border-orange-500/40",
    emerald: "hover:border-emerald-500/40",
    blue: "hover:border-blue-500/40",
    purple: "hover:border-purple-500/40",
    amber: "hover:border-amber-500/40",
  };

  const iconBgStyles = {
    neutral: "bg-secondary text-muted-foreground border-border",
    orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  };

  return (
    <div
      className={cn(
        "p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between transition-all duration-200 group/stat",
        accentStyles[accent],
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {badge}
            </span>
          )}
          {icon && (
            <div
              className={cn(
                "h-7 w-7 rounded-lg border flex items-center justify-center transition-transform group-hover/stat:scale-110",
                iconBgStyles[accent]
              )}
            >
              {icon}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3.5">
        <div
          className={cn(
            "text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-foreground",
            valueClassName
          )}
        >
          {value}
        </div>
        {description && (
          <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5 font-medium">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
