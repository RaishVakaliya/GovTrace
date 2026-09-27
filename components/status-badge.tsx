import React from "react";
import { ApplicationStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle2,
  FileSearch,
  Printer,
  FileCheck,
} from "lucide-react";

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  switch (status) {
    case "Submitted":
      return (
        <Badge variant="submitted" className={className}>
          {showIcon && <FileCheck className="w-3.5 h-3.5 mr-1.5 text-slate-500" />}
          Submitted
        </Badge>
      );
    case "Accepted":
      return (
        <Badge variant="accepted" className={className}>
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-blue-600 dark:text-blue-400" />}
          Accepted
        </Badge>
      );
    case "Under Review":
      return (
        <Badge variant="review" className={className}>
          {showIcon && <FileSearch className="w-3.5 h-3.5 mr-1.5 text-amber-600 dark:text-amber-400 animate-pulse" />}
          Under Review
        </Badge>
      );
    case "Approved/Printing":
      return (
        <Badge variant="approved" className={className}>
          {showIcon && <Printer className="w-3.5 h-3.5 mr-1.5 text-purple-600 dark:text-purple-400" />}
          Approved / Printing
        </Badge>
      );
    case "Ready for Collection":
      return (
        <Badge variant="ready" className={className}>
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />}
          Ready for Collection
        </Badge>
      );
    default:
      return <Badge variant="secondary" className={className}>{status}</Badge>;
  }
}
