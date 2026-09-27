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
  ShieldCheck,
  Building2,
  Search,
  Filter,
  RefreshCw,
  Edit3,
  ExternalLink,
  Users,
  FileCheck2,
  Clock,
  PackageCheck,
  Printer,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Application } from "@/types";

export default function AdminPortalPage() {
  const { departments, getDepartmentApplications, resetData } = useGovStore();
  const [selectedDeptId, setSelectedDeptId] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [officerName, setOfficerName] = useState("Officer Sarah Vance");

  // Status update modal state
  const [targetApp, setTargetApp] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setOfficerName(data.user.name || "Officer Sarah Vance");
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

  // Calculate metrics
  const totalCount = allApps.length;
  const underReviewCount = allApps.filter((a) => a.status === "Under Review" || a.status === "Submitted").length;
  const printingCount = allApps.filter((a) => a.status === "Approved/Printing").length;
  const readyCount = allApps.filter((a) => a.status === "Ready for Collection").length;

  const handleOpenStatusModal = (app: Application) => {
    setTargetApp(app);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Department Official Console
            </h1>
            <span className="text-xs bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 font-bold px-2 py-0.5 rounded-full">
              Official Adjudicator
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Logged in as <span className="font-semibold text-slate-800 dark:text-slate-200">{officerName}</span>.
            Review lodged dossiers and broadcast real-time status transitions to connected citizens.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => resetData()}
            className="text-xs text-slate-600 dark:text-slate-300 flex items-center space-x-1.5"
            title="Reset sample applications to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </Button>

          <Link href="/apply">
            <Button size="sm" className="text-xs font-semibold">
              + Lodge On Behalf of Citizen
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Assigned</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {totalCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Active applications</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
            {underReviewCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Requires vetting</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Laser Printing</span>
            <Printer className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-purple-600 dark:text-purple-400">
            {printingCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Production stage</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Ready for Collection</span>
            <PackageCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {readyCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Counter dispatch</p>
        </Card>
      </div>

      {/* Filter and Search Controls */}
      <Card className="p-4 border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="sm:col-span-5 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by Tracking ID, applicant name, or document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs"
            />
          </div>

          {/* Department Filter */}
          <div className="sm:col-span-4">
            <Select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="text-xs h-10"
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </Select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs h-10"
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
      </Card>

      {/* Applications Data Table */}
      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-md">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
            <TableRow>
              <TableHead className="w-[180px]">Tracking ID</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Document Type</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Adjudication Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-xs text-slate-500">
                  No applications match your department or status filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredApps.map((app) => (
                <TableRow key={app._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <TableCell className="font-mono font-bold text-xs text-blue-900 dark:text-blue-300">
                    <Link
                      href={`/track/${app.trackingId}`}
                      className="hover:underline flex items-center space-x-1"
                      title="View public stepper"
                    >
                      <span>{app.trackingId}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </TableCell>

                  <TableCell className="text-xs">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {app.applicantName || "Citizen"}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {app.applicantIdNumber || app.applicantEmail || "NAT-VERIFIED"}
                    </div>
                  </TableCell>

                  <TableCell className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {app.documentType}
                  </TableCell>

                  <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {app.departmentCode || "GOV"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={app.status} className="text-[11px]" />
                  </TableCell>

                  <TableCell className="text-xs text-slate-500 font-mono">
                    {formatDate(app.updatedAt)}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleOpenStatusModal(app)}
                      className="text-xs h-8 px-2.5 font-semibold bg-blue-700 hover:bg-blue-800 text-white"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1" />
                      <span>Update Status</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Status Update Modal */}
      <StatusUpdateModal
        application={targetApp}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        officerName={officerName}
      />
    </div>
  );
}
