"use client";

import React, { useState } from "react";
import { Application, ApplicationStatus, APPLICATION_STATUS_ORDER } from "@/types";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { useGovStore } from "@/components/providers/convex-client-provider";
import { Check, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

interface StatusUpdateModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  officerName?: string;
}

export function StatusUpdateModal({
  application,
  isOpen,
  onClose,
  officerName = "Officer Sarah Vance",
}: StatusUpdateModalProps) {
  const { updateStatus } = useGovStore();
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | null>(null);
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  // Sync state when application opens
  React.useEffect(() => {
    if (application) {
      setSelectedStatus(application.status);
      setRemarks(application.remarks || "");
      setSuccessNotice(false);
    }
  }, [application]);

  if (!application) return null;

  const currentIdx = APPLICATION_STATUS_ORDER.indexOf(application.status);
  const nextStatus = currentIdx < APPLICATION_STATUS_ORDER.length - 1 ? APPLICATION_STATUS_ORDER[currentIdx + 1] : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;

    setIsSubmitting(true);
    try {
      updateStatus({
        applicationId: application._id,
        status: selectedStatus,
        officerId: officerName,
        officerName: officerName,
        comment: remarks.trim() || `Status updated to ${selectedStatus} by ${officerName}`,
      });

      setSuccessNotice(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessNotice(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error("Status update failed:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="flex items-center space-x-2 text-xl">
              <ShieldCheck className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              <span>Update Document Status</span>
            </DialogTitle>
          </div>
          <DialogDescription>
            Official adjudication console for application{" "}
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              {application.trackingId}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          {/* Summary Box */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-500">Applicant:</span>{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {application.applicantName || "Citizen"}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Document:</span>{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {application.documentType}
              </span>
            </div>
            <div className="col-span-2 flex items-center space-x-2 pt-1 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-500">Current Status:</span>
              <StatusBadge status={application.status} />
            </div>
          </div>

          {/* Quick Action Button for Next Logical Milestone */}
          {nextStatus && (
            <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-3 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">
                  Quick Advance to Next Stage
                </p>
                <p className="text-[11px] text-blue-700 dark:text-blue-400">
                  Click to set status to {nextStatus}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="default"
                onClick={() => setSelectedStatus(nextStatus)}
                className="text-xs h-8"
              >
                Advance to {nextStatus}
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          )}

          {/* Stage Selector Grid */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Select Adjudicated Status:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {APPLICATION_STATUS_ORDER.map((st) => {
                const isSelected = selectedStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStatus(st)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 text-blue-900 font-semibold ring-1 ring-blue-500 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-500"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={st} showIcon={false} />
                      <span>{st}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-700 dark:text-blue-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Officer Remarks */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Official Comments & Citizen Instructions:
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Identity documents vetted. Ready at Counter 4. Bring original National ID."
              className="w-full text-xs rounded-md border border-slate-300 bg-white p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !selectedStatus}
            className="text-xs font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Broadcasting...
              </>
            ) : successNotice ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Updated!
              </>
            ) : (
              "Save & Broadcast Status"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
