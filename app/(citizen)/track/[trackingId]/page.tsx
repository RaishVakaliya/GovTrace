"use client";

import React, { use } from "react";
import Link from "next/link";
import { useGovStore } from "@/components/providers/convex-client-provider";
import { StatusBadge } from "@/components/status-badge";
import { StatusStepper } from "@/components/status-stepper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Printer, ArrowLeft } from "lucide-react";
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
      <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-3">
        <p className="text-sm font-medium text-foreground">
          Record not found for ID &quot;{trackingId}&quot;
        </p>
        <p className="text-xs text-muted-foreground">
          Please verify your tracking number and try again.
        </p>
        <Link href="/">
          <Button size="sm" variant="outline" className="h-8 text-xs font-normal">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Return to Search
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">
      {/* Breadcrumbs & Print */}
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Citizen Hub</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-mono">{application.trackingId}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="h-8 gap-1.5 text-xs font-normal"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print Slip</span>
        </Button>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader className="border-b border-border pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-semibold text-foreground">
                  {application.trackingId}
                </span>
                <StatusBadge status={application.status} />
              </div>
              <CardDescription className="text-xs">
                {application.documentType} • Lodged {formatDate(application.createdAt)}
              </CardDescription>
            </div>

            <div className="text-xs text-muted-foreground">
              Authority: <span className="font-medium text-foreground">{application.department?.name || application.departmentName || "State Authority"}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-md border border-border bg-muted/20 p-4 text-xs">
            <div>
              <span className="text-muted-foreground block">Applicant</span>
              <span className="font-medium text-foreground block">
                {application.applicantName || "Citizen"}
              </span>
              <span className="text-muted-foreground font-mono text-[11px]">
                {application.applicantEmail}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block">Authority Code</span>
              <span className="font-mono font-medium text-foreground block">
                {application.department?.code || "GOV"}
              </span>
              <span className="text-muted-foreground text-[11px]">
                {application.department?.name || "Official Department"}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block">Last Transition</span>
              <span className="font-mono font-medium text-foreground block">
                {formatDate(application.updatedAt)}
              </span>
            </div>
          </div>

          {/* Stepper */}
          <StatusStepper
            currentStatus={application.status}
            statusLogs={application.statusLogs}
            orientation="horizontal"
            showLogDetails={true}
          />

          {/* Collection Notice */}
          {application.status === "Ready for Collection" && (
            <div className="rounded-md border border-border bg-muted/40 p-4 text-xs space-y-1">
              <span className="font-medium text-foreground block">
                Ready for Collection
              </span>
              <p className="text-muted-foreground">
                {application.remarks ||
                  "Please present this confirmation slip and valid photo identification at the departmental service counter."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
