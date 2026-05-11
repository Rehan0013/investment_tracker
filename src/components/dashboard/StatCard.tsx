import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: ReactNode;
  className?: string;
  valueClassName?: string;
}

export function StatCard({ title, value, icon, description, className, valueClassName }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden border-border bg-card hover:bg-muted/30 transition-colors shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className={cn("text-3xl font-light tracking-tight text-foreground mt-1", valueClassName)}>{value}</div>
        {description && <div className="text-xs text-muted-foreground mt-3 font-medium tracking-wide">{description}</div>}
      </CardContent>
    </Card>
  );
}
