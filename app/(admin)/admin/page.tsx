"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useGovStore } from "@/components/providers/convex-client-provider";
import { StatusBadge } from "@/components/status-badge";
import { StatusUpdateModal } from "@/components/status-update-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
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
import {
  Search,
  ExternalLink,
  Plus,
  Inbox,
  Shield,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Application, AuthSession } from "@/types";

export default function AdminPortalPage() {
  const { departments, getDepartmentApplications } = useGovStore();
  const [selectedDeptId, setSelectedDeptId] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [session, setSession] = useState<AuthSession | null>(null);

  const [targetApp, setTargetApp] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setSession(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const allApps = getDepartmentApplications(selectedDeptId, selectedStatus);

  const filteredApps = allApps.filter((app) => {
    const q = searchQuery.toLowerCase();
    return (
      app.trackingId.toLowerCase().includes(q) ||
      (app.applicantName && app.applicantName.toLowerCase().includes(q)) ||
      app.documentType.toLowerCase().includes(q)
    );
  });

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

  const officerDisplayName = session?.name || "Official Department Officer";

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
            <BreadcrumbPage>Official Queue Console</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Departmental Adjudication Queue
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Active state processing queue. Authenticated officer: <span className="text-foreground font-medium">{officerDisplayName}</span>.
          </p>
        </div>

        <Link href="/apply">
          <Button size="sm" className="h-8 gap-1.5 text-xs font-normal">
            <Plus className="h-3.5 w-3.5" />
            <span>Intake Application</span>
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs text-muted-foreground">Total Assigned</span>
          <div className="text-2xl font-semibold tracking-tight text-foreground mt-1">
            {totalCount}
          </div>
        </Card>

        <Card className="p-4">
          <span className="text-xs text-muted-foreground">Pending Review</span>
          <div className="text-2xl font-semibold tracking-tight text-foreground mt-1">
            {underReviewCount}
          </div>
        </Card>

        <Card className="p-4">
          <span className="text-xs text-muted-foreground">Security Print</span>
          <div className="text-2xl font-semibold tracking-tight text-foreground mt-1">
            {printingCount}
          </div>
        </Card>

        <Card className="p-4">
          <span className="text-xs text-muted-foreground">Ready for Pickup</span>
          <div className="text-2xl font-semibold tracking-tight text-foreground mt-1">
            {readyCount}
          </div>
        </Card>
      </div>

      {/* Filter and Search Controls */}
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
            <option value="ALL">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Accepted">Accepted</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved/Printing">Approved/Printing</option>
            <option value="Ready for Collection">Ready for Collection</option>
          </Select>
        </div>
      </div>

      {/* Applications Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Tracking ID</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Dept</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 space-y-3">
                  <Inbox className="h-9 w-9 text-muted-foreground/60 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground">
                      No Records in Department Queue
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      There are currently no document verification requests matching this filter criteria.
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
                    <div className="text-[11px] font-mono text-muted-foreground">{app.applicantIdNumber || app.applicantEmail || "NAT-ID"}</div>
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
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

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
