"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useGovStore } from "@/components/providers/convex-client-provider";
import { StatusBadge } from "@/components/status-badge";
import { StatusStepper } from "@/components/status-stepper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Inbox,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { APPLICATION_STATUS_ORDER, AuthSession } from "@/types";

export default function CitizenDashboardPage() {
  const { getUserApplications, getByTrackingId } = useGovStore();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

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

  const applications = mounted ? getUserApplications(session?.userId, session?.email) : [];

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.documentType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleExpand = (id: string) => {
    setExpandedAppId(expandedAppId === id ? null : id);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Citizen Hub</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Citizen Document Hub
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5" suppressHydrationWarning>
            {mounted && session ? (
              <>Applications registered under <span className="text-foreground font-medium">{session.name}</span>.</>
            ) : (
              "Review and monitor all lodged document verification requests."
            )}
          </p>
        </div>

        <Link href="/apply">
          <Button size="sm" className="h-8 gap-1.5 text-xs font-normal">
            <Plus className="h-3.5 w-3.5" />
            <span>New Document Request</span>
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by Tracking ID or Document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-xs"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 text-xs"
          >
            <option value="ALL">All Statuses ({applications.length})</option>
            <option value="Submitted">Submitted</option>
            <option value="Accepted">Accepted</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved/Printing">Approved/Printing</option>
            <option value="Ready for Collection">Ready for Collection</option>
          </Select>
        </div>
      </div>

      {/* Table Card */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Tracking ID</TableHead>
              <TableHead>Document Type</TableHead>
              <TableHead>Authority</TableHead>
              <TableHead className="w-[180px]">Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Lodged</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!mounted ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-xs text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                  <span>Loading applications...</span>
                </TableCell>
              </TableRow>
            ) : filteredApps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 space-y-3">
                  <Inbox className="h-9 w-9 text-muted-foreground/60 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground">
                      No Applications on File
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      You do not have any active or pending document requests registered. Submit a new application to initiate the state verification workflow.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link href="/apply">
                      <Button size="sm" variant="outline" className="h-8 text-xs font-normal">
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Lodge an Application
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredApps.map((app) => {
                const isExpanded = expandedAppId === app._id;
                const fullDetails = getByTrackingId(app.trackingId);
                const currentIdx = APPLICATION_STATUS_ORDER.indexOf(app.status);
                const percent = Math.round(
                  (Math.max(0, currentIdx) / (APPLICATION_STATUS_ORDER.length - 1)) * 100
                );

                return (
                  <React.Fragment key={app._id}>
                    <TableRow className="text-xs">
                      <TableCell className="font-mono font-medium text-foreground">
                        <Link
                          href={`/track/${app.trackingId}`}
                          className="hover:underline flex items-center gap-1"
                        >
                          <span>{app.trackingId}</span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </Link>
                      </TableCell>

                      <TableCell className="font-medium text-foreground">
                        {app.documentType}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {app.departmentCode || "GOV"}
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-muted-foreground">
                            <span>Step {currentIdx + 1}/5</span>
                            <span className="font-mono">{percent}%</span>
                          </div>
                          <Progress value={percent} className="h-1" />
                        </div>
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={app.status} />
                      </TableCell>

                      <TableCell className="text-muted-foreground font-mono text-[11px]">
                        {formatDate(app.createdAt)}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(app._id)}
                          className="h-7 px-2 text-xs"
                        >
                          <span>{isExpanded ? "Hide" : "Details"}</span>
                          {isExpanded ? (
                            <ChevronUp className="h-3 w-3 ml-1" />
                          ) : (
                            <ChevronDown className="h-3 w-3 ml-1" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Expandable Stepper Sub-Row */}
                    {isExpanded && (
                      <TableRow className="bg-muted/20">
                        <TableCell colSpan={7} className="p-4 sm:p-6">
                          <div className="max-w-3xl space-y-4">
                            <span className="text-xs font-medium text-foreground block">
                              Process Stepper for {app.trackingId}
                            </span>
                            <StatusStepper
                              currentStatus={app.status}
                              statusLogs={fullDetails?.statusLogs}
                              showLogDetails={true}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
