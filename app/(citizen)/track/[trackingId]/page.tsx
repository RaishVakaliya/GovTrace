"use client";

import React, { use } from "react";
import Link from "next/link";
import { useGovStore } from "@/components/providers/convex-client-provider";
import { StatusBadge } from "@/components/status-badge";
import { StatusStepper } from "@/components/status-stepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ShieldCheck,
  Building2,
  Printer,
  Calendar,
  User,
  ArrowLeft,
  Share2,
  CheckCircle2,
  AlertTriangle,
  BadgeAlert,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function TrackDetailPage({
  params,
}: {
  params: Promise<{ trackingId: string }>;
}) {
  const unwrappedParams = use(params);
  const trackingId = decodeURIComponent(unwrappedParams.trackingId);
  const { getByTrackingId } = useGovStore();

  const application = getByTrackingId(trackingId);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (!application) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <BadgeAlert className="w-12 h-12 text-amber-500 mx-auto" />
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Application Reference Not Found
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          We could not locate any active or archived document record for reference{" "}
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
            {trackingId}
          </span>
          .
        </p>
        <div className="pt-2">
          <Link href="/">
            <Button size="sm" variant="outline" className="text-xs">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Back to Tracking Search
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back and Action Buttons */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="text-xs text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="text-xs flex items-center space-x-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Slip</span>
          </Button>
        </div>
      </div>

      {/* Main Official Tracking Dossier */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden bg-white dark:bg-slate-900">
        {/* Top Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs text-blue-300 font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Official State Registry Slip</span>
            </div>
            <h1 className="font-mono text-2xl sm:text-3xl font-black text-white tracking-wider">
              {application.trackingId}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Document: {application.documentType}
            </p>
          </div>

          <div className="flex flex-col sm:items-end space-y-1">
            <span className="text-[11px] text-slate-400">Current Status:</span>
            <StatusBadge status={application.status} className="text-sm py-1 px-3" />
          </div>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-8">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs">
            <div>
              <span className="text-slate-500 block font-medium">Applicant Name</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {application.applicantName || "Citizen"}
              </span>
              <span className="text-[11px] text-slate-400 block font-mono">
                {application.applicantEmail}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block font-medium">Issuing Authority</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {application.department?.name || application.departmentName || "State Authority"}
              </span>
              <span className="text-[11px] text-slate-400 block font-mono">
                Dept Code: {application.department?.code || "GOV"}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block font-medium">Submission Timestamp</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {formatDate(application.createdAt)}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-medium">
                Last updated: {formatDate(application.updatedAt)}
              </span>
            </div>
          </div>

          {/* Stepper Component */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 text-blue-600" />
                Live Processing Milestones
              </h2>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1.5" />
                Convex Real-Time Stream
              </span>
            </div>

            <StatusStepper
              currentStatus={application.status}
              statusLogs={application.statusLogs}
              orientation="horizontal"
              showLogDetails={true}
            />
          </div>

          {/* Special Official Collection Notice if Ready */}
          {application.status === "Ready for Collection" && (
            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40 flex items-start space-x-3 text-emerald-950 dark:text-emerald-200 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="font-bold text-sm">Document Ready for Collection</p>
                <p>
                  {application.remarks ||
                    "Please visit Counter 4 at the State Center. Bring your original National ID and this printed confirmation slip."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
