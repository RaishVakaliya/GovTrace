"use client";

import React from "react";
import { ApplicationStatus, APPLICATION_STATUS_ORDER, StatusLog } from "@/types";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusStepperProps {
  currentStatus: ApplicationStatus;
  statusLogs?: StatusLog[];
  orientation?: "horizontal" | "vertical";
  showLogDetails?: boolean;
}

const STEP_DEFINITIONS = [
  { key: "Submitted", label: "Submitted", description: "Lodged in system" },
  { key: "Accepted", label: "Accepted", description: "Intake verified" },
  { key: "Under Review", label: "Under Review", description: "Background validation" },
  { key: "Approved/Printing", label: "Approved", description: "Security processing" },
  { key: "Ready for Collection", label: "Ready", description: "Available for pickup" },
];

export function StatusStepper({
  currentStatus,
  statusLogs = [],
  showLogDetails = true,
}: StatusStepperProps) {
  const currentIndex = APPLICATION_STATUS_ORDER.indexOf(currentStatus);
  const progressPercent = Math.round(
    (Math.max(0, currentIndex) / (APPLICATION_STATUS_ORDER.length - 1)) * 100
  );

  const logMap = new Map<string, StatusLog>();
  statusLogs.forEach((log) => {
    logMap.set(log.status, log);
  });

  return (
    <div className="w-full space-y-6">
      {/* Progress Metric Header */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground font-normal">Progress Status</span>
          <span className="font-mono text-xs text-foreground font-medium">
            {progressPercent}% completed
          </span>
        </div>
        <Progress value={progressPercent} className="h-1.5" />
      </div>

      {/* Horizontal Steps on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
        {STEP_DEFINITIONS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const log = logMap.get(step.key);

          return (
            <div key={step.key} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono",
                    isCurrent
                      ? "bg-primary text-primary-foreground font-semibold"
                      : isCompleted
                      ? "bg-muted text-foreground border border-border"
                      : "bg-muted/50 text-muted-foreground border border-border/50"
                  )}
                >
                  {isCompleted ? <Check className="h-3 w-3 stroke-[2.5]" /> : idx + 1}
                </div>
                <span
                  className={cn(
                    "text-xs",
                    isCurrent
                      ? "font-semibold text-foreground"
                      : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              <div className="pl-7">
                <p className="text-[11px] text-muted-foreground">
                  {step.description}
                </p>
                {log && (
                  <p className="text-[10px] font-mono text-muted-foreground/80 mt-0.5">
                    {formatDate(log.timestamp)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Audit Log Details */}
      {showLogDetails && statusLogs.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border space-y-2">
          <span className="text-xs font-medium text-foreground block">
            Verification Trail
          </span>
          <div className="divide-y divide-border rounded-md border border-border bg-card">
            {statusLogs.map((log) => (
              <div
                key={log._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 text-xs gap-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-foreground font-medium">
                    [{log.status}]
                  </span>
                  <span className="text-muted-foreground">
                    {log.comment || "Status updated"}
                  </span>
                  {log.updatedBy && (
                    <span className="text-muted-foreground/70 hidden sm:inline">
                      — {log.updatedBy}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                  {formatDate(log.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
