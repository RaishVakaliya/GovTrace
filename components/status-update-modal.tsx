"use client";

import React, { useState } from "react";
import { Application, ApplicationStatus, APPLICATION_STATUS_ORDER } from "@/types";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { useGovStore } from "@/components/providers/convex-client-provider";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

  React.useEffect(() => {
    if (application) {
      setSelectedStatus(application.status);
      setRemarks(application.remarks || "");
    }
  }, [application]);

  if (!application) return null;

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
        comment: remarks.trim() || `Status updated to ${selectedStatus}`,
      });

      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 400);
    } catch (err) {
      console.error("Status update error:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Update Application Status
          </DialogTitle>
          <DialogDescription className="text-xs">
            Tracking ID: <span className="font-mono font-medium text-foreground">{application.trackingId}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Summary */}
          <div className="rounded-md border border-border bg-muted/40 p-3 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Applicant</span>
              <span className="font-medium text-foreground">{application.applicantName || "Citizen"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Document Type</span>
              <span className="font-medium text-foreground">{application.documentType}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-border">
              <span className="text-muted-foreground">Current Status</span>
              <StatusBadge status={application.status} />
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground block">
              Set New Status
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {APPLICATION_STATUS_ORDER.map((st) => {
                const isSelected = selectedStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStatus(st)}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-md border text-left text-xs transition-colors",
                      isSelected
                        ? "border-primary bg-secondary text-foreground font-medium"
                        : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span>{st}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-foreground" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground block">
              Official Comments / Collection Instructions
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Document verified. Ready for collection at Counter 4."
              className="w-full text-xs rounded-md border border-input bg-background p-2.5 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !selectedStatus}
            className="text-xs font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                Broadcasting...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
