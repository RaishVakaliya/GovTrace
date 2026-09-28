"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useGovStore } from "@/components/providers/convex-client-provider";
import { StatusBadge } from "@/components/status-badge";
import { StatusUpdateModal } from "@/components/status-update-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ExternalLink,
  Inbox,
  Shield,
  Printer,
  CheckCircle2,
  Clock,
  FileSearch,
  PackageCheck,
  Building,
  RotateCw,
  Loader2,
  FileCheck2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Application, AuthSession } from "@/types";

export default function AdminPortalPage() {
  const { departments, getDepartmentApplications } = useGovStore();
  const [selectedDeptId, setSelectedDeptId] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [session, setSession] = useState<AuthSession | null>(null);
  const [mounted, setMounted] = useState(false);

  // Workflow queue filter tabs
  const [activeQueueTab, setActiveQueueTab] = useState<"ALL" | "ACTION_REQUIRED" | "PRINTING" | "READY">("ALL");

  const [targetApp, setTargetApp] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setSession(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const allApps = mounted ? getDepartmentApplications(selectedDeptId, selectedStatus) : [];

  // Filter based on active queue tab and search query
  const filteredApps = allApps.filter((app) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      app.trackingId.toLowerCase().includes(q) ||
      (app.applicantName && app.applicantName.toLowerCase().includes(q)) ||
      app.documentType.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (activeQueueTab === "ACTION_REQUIRED") {
      return app.status === "Submitted" || app.status === "Under Review";
    }
    if (activeQueueTab === "PRINTING") {
      return app.status === "Approved/Printing";
    }
    if (activeQueueTab === "READY") {
      return app.status === "Ready for Collection";
    }
    return true;
  });

  // KPI Calculations
  const totalCount = allApps.length;
  const underReviewCount = allApps.filter(
    (a) => a.status === "Under Review" || a.status === "Submitted"
  ).length;
  const printingCount = allApps.filter(
    (a) => a.status === "Approved/Printing"
  ).length;
  const readyCount = allApps.filter(
    (a) => a.status === "Ready for Collection"
  ).length;

  const handleOpenStatusModal = (app: Application) => {
    setTargetApp(app);
    setIsModalOpen(true);
  };

  const handlePrintBatchManifest = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const officerDisplayName = session?.name || "Official Department Officer";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">State Department Portal</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Official Adjudication Console</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Official Shift & Security Clearance Header */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-foreground">
              <Building className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                  Department Adjudication Console
                </h1>
                <Badge variant="outline" className="font-mono text-[10px] uppercase">
                  Classified Official Access
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                Active Officer: <span className="font-medium text-foreground">{officerDisplayName}</span> • Station ID: <code className="font-mono">DSCR-STATION-04</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrintBatchManifest}
              className="h-8 gap-1.5 text-xs font-normal"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Batch Manifest</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Interactive Metric Tiles with Queue Switching */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => setActiveQueueTab("ALL")}
          className={`text-left transition-colors rounded-lg border p-4 ${
            activeQueueTab === "ALL"
              ? "border-primary bg-secondary/60 ring-1 ring-primary/20"
              : "border-border bg-card hover:bg-muted/40"
          }`}
        >
          <span className="text-xs text-muted-foreground block">Total Active Queue</span>
          <div className="text-2xl font-semibold tracking-tight text-foreground mt-1" suppressHydrationWarning>
            {mounted ? totalCount : 0}
          </div>
          <span className="text-[10px] text-muted-foreground block mt-0.5">All assigned dossiers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveQueueTab("ACTION_REQUIRED")}
          className={`text-left transition-colors rounded-lg border p-4 ${
            activeQueueTab === "ACTION_REQUIRED"
              ? "border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 ring-1 ring-amber-500/20"
              : "border-border bg-card hover:bg-muted/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Action Required</span>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-semibold tracking-tight text-amber-600 dark:text-amber-400 mt-1" suppressHydrationWarning>
            {mounted ? underReviewCount : 0}
          </div>
          <span className="text-[10px] text-muted-foreground block mt-0.5">Submitted / In Review</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveQueueTab("PRINTING")}
          className={`text-left transition-colors rounded-lg border p-4 ${
            activeQueueTab === "PRINTING"
              ? "border-primary bg-secondary/60 ring-1 ring-primary/20"
              : "border-border bg-card hover:bg-muted/40"
          }`}
        >
          <span className="text-xs text-muted-foreground block">Security Printing</span>
          <div className="text-2xl font-semibold tracking-tight text-foreground mt-1" suppressHydrationWarning>
            {mounted ? printingCount : 0}
          </div>
          <span className="text-[10px] text-muted-foreground block mt-0.5">Laser engraving queue</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveQueueTab("READY")}
          className={`text-left transition-colors rounded-lg border p-4 ${
            activeQueueTab === "READY"
              ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-1 ring-emerald-500/20"
              : "border-border bg-card hover:bg-muted/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Ready for Collection</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400 mt-1" suppressHydrationWarning>
            {mounted ? readyCount : 0}
          </div>
          <span className="text-[10px] text-muted-foreground block mt-0.5">Counter dispatch ready</span>
        </button>
      </div>

      {/* Search and Authority Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by Reference ID, applicant name, or document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-xs"
          />
        </div>

        <div className="w-full sm:w-56">
          <Select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="h-9 text-xs"
          >
            <option value="ALL">All Departments</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.code} - {dept.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="w-full sm:w-44">
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 text-xs"
          >
            <option value="ALL">All Status Milestones</option>
            <option value="Submitted">Submitted</option>
            <option value="Accepted">Accepted</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved/Printing">Approved/Printing</option>
            <option value="Ready for Collection">Ready for Collection</option>
          </Select>
        </div>
      </div>

      {/* Main Applications Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Tracking ID</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Document Type</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Transition</TableHead>
              <TableHead className="text-right">Adjudication</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!mounted ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-xs text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                  <span>Loading department queue...</span>
                </TableCell>
              </TableRow>
            ) : filteredApps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 space-y-3">
                  <Inbox className="h-9 w-9 text-muted-foreground/60 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground">
                      No Records in Department Queue
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      There are currently no citizen applications matching the selected criteria in this station.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredApps.map((app) => (
                <TableRow key={app._id} className="text-xs">
                  <TableCell className="font-mono font-medium text-foreground">
                    <Link
                      href={`/track/${app.trackingId}`}
                      className="hover:underline flex items-center gap-1"
                    >
                      <span>{app.trackingId}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </Link>
                  </TableCell>

                  <TableCell>
                    <div className="font-medium text-foreground">{app.applicantName || "Citizen"}</div>
                    <div className="text-[11px] font-mono text-muted-foreground">
                      {app.applicantIdNumber || app.applicantEmail || "NAT-ID"}
                    </div>
                  </TableCell>

                  <TableCell className="font-medium text-foreground">
                    {app.documentType}
                  </TableCell>

                  <TableCell className="text-muted-foreground font-medium">
                    {app.departmentCode || "GOV"}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>

                  <TableCell className="font-mono text-muted-foreground text-[11px]">
                    {formatDate(app.updatedAt)}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenStatusModal(app)}
                      className="h-7 text-xs font-normal"
                    >
                      Advance Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Statutory Guidance */}
      <div className="rounded-md border border-border bg-muted/20 p-4 text-xs space-y-1">
        <div className="flex items-center gap-1.5 text-foreground font-medium">
          <Shield className="h-3.5 w-3.5" />
          <span>Statutory Officer Mandate</span>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Every status transition executed in this console triggers an automated notification and broadcasts to connected citizen views in real time. Officials must verify prerequisite physical scans and biometric clearances prior to advancing records to &apos;Approved/Printing&apos;.
        </p>
      </div>

      {/* Status Transition Modal */}
      <StatusUpdateModal
        application={targetApp}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        officerName={officerDisplayName}
      />
    </div>
  );
}
