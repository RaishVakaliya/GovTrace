"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGovStore } from "@/components/providers/convex-client-provider";
import { StatusBadge } from "@/components/status-badge";
import { StatusStepper } from "@/components/status-stepper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Search,
  ShieldCheck,
  FileCheck2,
  Clock,
  Building2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  UserCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  const { getByTrackingId } = useGovStore();
  const [searchInput, setSearchInput] = useState("");
  const [activeTrackingId, setActiveTrackingId] = useState("GT-2026-A891K");
  const [hasSearched, setHasSearched] = useState(true);

  const trackingResult = getByTrackingId(activeTrackingId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setActiveTrackingId(searchInput.trim());
    setHasSearched(true);
  };

  const handleQuickSample = (id: string) => {
    setSearchInput(id);
    setActiveTrackingId(id);
    setHasSearched(true);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section with Public Tracking */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-blue-200 text-xs font-semibold backdrop-blur-sm shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>State Digital Transparency Initiative</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Real-Time Government <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-300">
              Document Process Tracking
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Eliminate bureaucracy opacity. Enter your state application or tracking ID to inspect live verification steps, officer adjudications, and collection notices.
          </p>

          {/* Search Form */}
          <div className="max-w-2xl mx-auto pt-4">
            <form
              onSubmit={handleSearch}
              className="bg-white/10 p-2 sm:p-2.5 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter Tracking ID (e.g., GT-2026-A891K)"
                  className="pl-11 h-12 bg-white text-slate-900 font-mono text-sm placeholder:text-slate-400 border-0 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 shadow-inner"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
              >
                <span>Track Live</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            {/* Quick Sample IDs */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="text-slate-500 font-medium">Try Sample IDs:</span>
              <button
                type="button"
                onClick={() => handleQuickSample("GT-2026-A891K")}
                className="font-mono text-blue-300 hover:text-white bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 hover:border-slate-500 transition-colors"
              >
                GT-2026-A891K (Passport)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSample("GT-2026-X419B")}
                className="font-mono text-amber-300 hover:text-white bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 hover:border-slate-500 transition-colors"
              >
                GT-2026-X419B (Driver License)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSample("GT-2026-M723T")}
                className="font-mono text-purple-300 hover:text-white bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 hover:border-slate-500 transition-colors"
              >
                GT-2026-M723T (Deed)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Search Result Showcase Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        {trackingResult ? (
          <Card className="shadow-2xl border-slate-200/80 dark:border-slate-800 backdrop-blur-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-lg tracking-wider text-white">
                      {trackingResult.trackingId}
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>Convex Sync Active</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Lodged: {formatDate(trackingResult.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={trackingResult.status} className="text-sm py-1 px-3" />
              </div>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-8">
              {/* Document Overview Header */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                <div>
                  <span className="text-slate-500 block font-medium">Document Type</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {trackingResult.documentType}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Target Authority</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {trackingResult.department?.name || trackingResult.departmentName || "State Authority"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Official Dispatch Status</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {trackingResult.remarks || "Processing standard workflow."}
                  </span>
                </div>
              </div>

              {/* Progress Milestones Stepper */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-6 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-blue-600" />
                  Real-Time Status Milestones
                </h3>
                <StatusStepper
                  currentStatus={trackingResult.status}
                  statusLogs={trackingResult.statusLogs}
                  orientation="horizontal"
                  showLogDetails={true}
                />
              </div>

              {/* Instructions / Next Steps Box */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 dark:border-blue-900/60 dark:bg-blue-950/20 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-blue-700 dark:text-blue-400 mt-0.5 shrink-0" />
                <div className="text-xs text-blue-900 dark:text-blue-300 space-y-1">
                  <p className="font-semibold">Official Citizen Notice:</p>
                  <p className="text-slate-700 dark:text-slate-300">
                    {trackingResult.status === "Ready for Collection"
                      ? "Your document is officially verified and printed. Please present your tracking ID and valid photo identity at the designated service counter."
                      : trackingResult.status === "Approved/Printing"
                      ? "Your document has passed all statutory checks and is currently queued in the laser printing & security watermark unit."
                      : trackingResult.status === "Under Review"
                      ? "Adjudicating officers are currently examining biometric checks and official records. You will receive real-time notifications on this screen."
                      : "Your application is active in the government pipeline."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : hasSearched ? (
          <Card className="shadow-lg border-red-200 dark:border-red-900 p-8 text-center bg-white dark:bg-slate-900">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              No Application Found for &quot;{activeTrackingId}&quot;
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Please double check your reference number or try one of our live sample records above.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSample("GT-2026-A891K")}
            >
              Load Sample Record
            </Button>
          </Card>
        ) : null}
      </section>

      {/* Fast Pathways / Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Integrated State Digital Infrastructure
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            GovTrace bridges the gap between citizens, civil registries, and departmental adjudicators with end-to-end auditability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 flex items-center justify-center mb-2">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <CardTitle className="text-base">Citizen Portal</CardTitle>
              <CardDescription className="text-xs">
                Log in via Google OAuth to monitor all your family applications, download receipts, and view live steppers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                  Open Citizen Portal
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 flex items-center justify-center mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <CardTitle className="text-base">Apply Online</CardTitle>
              <CardDescription className="text-xs">
                Lodge document renewal requests directly with the Civil Registry, Transport Authority, or Land Bureau in minutes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/apply">
                <Button variant="default" size="sm" className="w-full text-xs font-semibold">
                  New Application Form
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 flex items-center justify-center mb-2">
                <Building className="w-5 h-5" />
              </div>
              <CardTitle className="text-base">Official Department Console</CardTitle>
              <CardDescription className="text-xs">
                Designated officer workflow to review incoming dossiers, endorse verifications, and broadcast real-time status transitions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                  Officer Dashboard
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
