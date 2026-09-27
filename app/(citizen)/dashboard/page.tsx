"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useGovStore } from "@/components/providers/convex-client-provider";
import { StatusBadge } from "@/components/status-badge";
import { StatusStepper } from "@/components/status-stepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  FilePlus2,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Calendar,
  Building2,
  FileText,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Application } from "@/types";

export default function CitizenDashboardPage() {
  const { getUserApplications, getByTrackingId } = useGovStore();
  const [userId, setUserId] = useState("demo-citizen-1");
  const [userName, setUserName] = useState("Elena Rostova");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedAppId, setExpandedAppId] = useState<string | null>("app-1");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserId(data.user.userId);
          setUserName(data.user.name);
        }
      })
      .catch(() => {});
  }, []);

  const applications = getUserApplications(userId);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Citizen Applications Dashboard
            </h1>
            <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">
              Live Feed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome, <span className="font-semibold text-slate-800 dark:text-slate-200">{userName}</span>.
            Track your ongoing government requests with real-time milestone synchronisation.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/apply">
            <Button className="flex items-center space-x-2 text-xs font-semibold shadow-sm">
              <FilePlus2 className="w-4 h-4" />
              <span>Lodge New Application</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by Tracking ID (e.g. GT-2026) or Document Type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-xs"
          />
        </div>

        <div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs h-10"
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

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-slate-300 dark:border-slate-800">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
              No matching applications found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              You haven&apos;t lodged any applications matching the selected criteria.
            </p>
            <Link href="/apply">
              <Button size="sm" variant="outline" className="text-xs font-semibold">
                Submit Your First Application
              </Button>
            </Link>
          </Card>
        ) : (
          filteredApps.map((app) => {
            const isExpanded = expandedAppId === app._id;
            const fullDetails = getByTrackingId(app.trackingId);

            return (
              <Card
                key={app._id}
                className="overflow-hidden border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all shadow-sm"
              >
                <div className="p-5 sm:p-6 space-y-5">
                  {/* Top Row: Tracking ID, Department, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-base font-black tracking-wider text-blue-900 dark:text-blue-300">
                          {app.trackingId}
                        </span>
                        <StatusBadge status={app.status} />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {app.documentType}
                      </h3>
                      <div className="flex items-center space-x-3 text-xs text-slate-500">
                        <span className="flex items-center">
                          <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {app.departmentName || "State Authority"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          Lodged: {formatDate(app.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-start sm:self-center">
                      <Link href={`/track/${app.trackingId}`}>
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          <span>Full Audit Slip</span>
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(app._id)}
                        className="text-xs h-8 text-slate-600 dark:text-slate-400"
                      >
                        <span>{isExpanded ? "Hide Steps" : "Show Stepper"}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 ml-1" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 ml-1" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Reactive Live Stepper View */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
                      <StatusStepper
                        currentStatus={app.status}
                        statusLogs={fullDetails?.statusLogs}
                        orientation="horizontal"
                        showLogDetails={true}
                      />
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
