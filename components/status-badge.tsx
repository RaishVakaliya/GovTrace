import React from "react";
import { ApplicationStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({ status, className, showDot = true }: StatusBadgeProps) {
  switch (status) {
    case "Submitted":
      return (
        <Badge variant="outline" className={cn("gap-1.5 font-normal text-muted-foreground bg-muted/50", className)}>
          {showDot && <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />}
          <span>Submitted</span>
        </Badge>
      );
    case "Accepted":
      return (
        <Badge variant="outline" className={cn("gap-1.5 font-normal text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/20", className)}>
          {showDot && <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />}
          <span>Accepted</span>
        </Badge>
      );
    case "Under Review":
      return (
        <Badge variant="outline" className={cn("gap-1.5 font-normal text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20", className)}>
          {showDot && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
          <span>Under Review</span>
        </Badge>
      );
    case "Approved/Printing":
      return (
        <Badge variant="outline" className={cn("gap-1.5 font-normal text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/40", className)}>
          {showDot && <span className="h-1.5 w-1.5 rounded-full bg-slate-600 dark:bg-slate-400" />}
          <span>Approved / Printing</span>
        </Badge>
      );
    case "Ready for Collection":
      return (
        <Badge variant="outline" className={cn("gap-1.5 font-medium text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30", className)}>
          {showDot && <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
          <span>Ready for Collection</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className={className}>
          {status}
        </Badge>
      );
  }
}
