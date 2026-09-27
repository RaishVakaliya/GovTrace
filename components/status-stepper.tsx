"use client";

import React from "react";
import { ApplicationStatus, APPLICATION_STATUS_ORDER, StatusLog } from "@/types";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  CheckCircle,
  Clock,
  Printer,
  PackageCheck,
  Check,
  Building2,
} from "lucide-react";

interface StatusStepperProps {
  currentStatus: ApplicationStatus;
  statusLogs?: StatusLog[];
  orientation?: "horizontal" | "vertical";
  showLogDetails?: boolean;
}

const STEP_DEFINITIONS = [
  {
    key: "Submitted",
    label: "Application Submitted",
    description: "Lodged securely into system",
    icon: FileText,
  },
  {
    key: "Accepted",
    label: "Accepted & Intake Vetted",
    description: "Initial verification passed",
    icon: CheckCircle,
  },
  {
    key: "Under Review",
    label: "Under Deep Review",
    description: "Official background validation",
    icon: Clock,
  },
  {
    key: "Approved/Printing",
    label: "Approved & Printing",
    description: "Laser engraving & security seal",
    icon: Printer,
  },
  {
    key: "Ready for Collection",
    label: "Ready for Collection",
    description: "Available at designated counter",
    icon: PackageCheck,
  },
];

export function StatusStepper({
  currentStatus,
  statusLogs = [],
  orientation = "horizontal",
  showLogDetails = true,
}: StatusStepperProps) {
  const currentIndex = APPLICATION_STATUS_ORDER.indexOf(currentStatus);
  const progressPercent = Math.round(
    (Math.max(0, currentIndex) / (APPLICATION_STATUS_ORDER.length - 1)) * 100
  );

  // Group logs by status to find the most recent log per step
  const logMap = new Map<string, StatusLog>();
  statusLogs.forEach((log) => {
    logMap.set(log.status, log);
  });

  return (
    <div className="w-full space-y-6">
      {/* Overall Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-medium text-slate-500">
          <span>Overall Progression</span>
          <span className="font-bold text-blue-700 dark:text-blue-400">
            {progressPercent}% Complete
          </span>
        </div>
        <Progress
          value={progressPercent}
          className="h-2.5 bg-slate-100 dark:bg-slate-800"
          indicatorClassName={
            progressPercent === 100
              ? "bg-emerald-600 dark:bg-emerald-500"
              : "bg-blue-600 dark:bg-blue-500"
          }
        />
      </div>

      {/* Stepper Display */}
      {orientation === "horizontal" ? (
        <div className="hidden md:grid grid-cols-5 gap-2 relative pt-2">
          {STEP_DEFINITIONS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isUpcoming = idx > currentIndex;
            const StepIcon = step.icon;
            const log = logMap.get(step.key);

            return (
              <div key={step.key} className="flex flex-col items-center text-center group">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                    isCurrent
                      ? "bg-blue-700 text-white ring-4 ring-blue-100 dark:ring-blue-900/50 scale-110"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-400 border border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>

                <div className="mt-3">
                  <p
                    className={`text-xs font-semibold leading-tight ${
                      isCurrent
                        ? "text-blue-900 dark:text-blue-300 font-bold"
                        : isCompleted
                        ? "text-slate-800 dark:text-slate-200"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {step.description}
                  </p>
                  {log && (
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                      {formatDate(log.timestamp)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Vertical Stepper & Detailed Audit Trail */}
      <div className={orientation === "horizontal" ? "md:hidden space-y-4" : "space-y-4"}>
        <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
          {STEP_DEFINITIONS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isUpcoming = idx > currentIndex;
            const StepIcon = step.icon;
            const log = logMap.get(step.key);

            return (
              <div key={step.key} className="relative flex items-start space-x-3.5">
                <div
                  className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm transition-all ${
                    isCurrent
                      ? "bg-blue-700 text-white ring-2 ring-blue-200 dark:ring-blue-900"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-400 dark:bg-slate-800"
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>

                <div className="flex-1 bg-slate-50/70 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <StepIcon
                        className={`w-4 h-4 ${
                          isCurrent
                            ? "text-blue-600 dark:text-blue-400"
                            : isCompleted
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-semibold ${
                          isCurrent
                            ? "text-blue-900 dark:text-blue-300"
                            : isCompleted
                            ? "text-slate-800 dark:text-slate-200"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {log && (
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {formatDate(log.timestamp)}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {step.description}
                  </p>

                  {log && log.comment && (
                    <div className="mt-2 text-xs bg-white dark:bg-slate-900/80 p-2 rounded border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {log.updatedBy || "Official Officer"}:
                      </span>{" "}
                      {log.comment}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Audit Trail List */}
      {showLogDetails && statusLogs.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center">
            <Building2 className="w-3.5 h-3.5 mr-1.5" />
            Official Processing History & Logs
          </h4>
          <div className="space-y-2 text-xs">
            {statusLogs.map((log) => (
              <div
                key={log._id}
                className="flex items-start justify-between py-1.5 px-2.5 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800"
              >
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 mr-2">
                    [{log.status}]
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {log.comment || "Status updated"}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 ml-2">
                    — {log.updatedBy}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono shrink-0 ml-2">
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
