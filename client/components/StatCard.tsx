import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow duration-200",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              {value}
            </p>
            {trend && (
              <span className={cn(
                "text-xs font-medium",
                trend.direction === "up"
                  ? "text-success"
                  : "text-destructive"
              )}>
                {trend.direction === "up" ? "↑" : "↓"} {trend.value}%
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className="text-primary opacity-20">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
