"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useGovStore } from "@/components/providers/convex-client-provider";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  ShieldCheck,
  FileText,
  ExternalLink,
  LogOut,
  Lock,
  Plus,
  Mail,
  Fingerprint,
  Loader2,
  Building,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { AuthSession } from "@/types";

export default function ProfilePage() {
  const { getUserApplications } = useGovStore();
  const [session, setSession] = useState<AuthSession | null>(null);
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
      .catch(() => { });
  }, []);

  const applications = mounted ? getUserApplications(session?.userId, session?.email) : [];

  // Status breakdown
  const submittedCount = applications.filter((a) => a.status === "Submitted").length;
  const acceptedCount = applications.filter((a) => a.status === "Accepted").length;
  const underReviewCount = applications.filter((a) => a.status === "Under Review").length;
  const printingCount = applications.filter((a) => a.status === "Approved/Printing").length;
  const readyCount = applications.filter((a) => a.status === "Ready for Collection").length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>State Registry Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Citizen & Official Registry Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Verified state identity record and document processing registry status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {session?.role === "official" ? (
            <Link href="/admin">
              <Button size="sm" className="h-8 gap-1.5 text-xs font-normal">
                <Building className="h-3.5 w-3.5" />
                <span>Official Queue Console</span>
              </Button>
            </Link>
          ) : (
            <Link href="/apply">
              <Button size="sm" className="h-8 gap-1.5 text-xs font-normal">
                <Plus className="h-3.5 w-3.5" />
                <span>New Document Request</span>
              </Button>
            </Link>
          )}
          <a href="/api/auth/logout">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-normal">
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Profile Card & Registry Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Identity Dossier */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-foreground">
                <Fingerprint className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  Identity Record
                </CardTitle>
                <CardDescription className="text-xs">
                  Official Public Dossier
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground block text-[11px]">Full Legal Name</span>
              <span className="font-semibold text-foreground text-sm block" suppressHydrationWarning>
                {mounted ? (session?.name || "State Registrant") : "Loading..."}
              </span>
            </div>

            <Separator />

            <div className="space-y-1">
              <span className="text-muted-foreground block text-[11px]">Official Email</span>
              <div className="flex items-center gap-1.5 text-foreground font-mono" suppressHydrationWarning>
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span>{mounted ? (session?.email || "verified.identity@gov.state") : "..."}</span>
              </div>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 pt-0.5">
                <Lock className="h-2.5 w-2.5 text-muted-foreground" />
                Identity Provider Verified (Immutable)
              </span>
            </div>

            <Separator />

            <div className="space-y-1">
              <span className="text-muted-foreground block text-[11px]">Assigned Role</span>
              <div className="flex items-center gap-2" suppressHydrationWarning>
                <Badge variant="outline" className="font-mono text-xs uppercase">
                  {mounted ? (session?.role || "Citizen") : "Citizen"}
                </Badge>
                <span className="text-[11px] text-muted-foreground">
                  {session?.role === "official" ? "Department Adjudicator" : "State Citizen"}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-1">
              <span className="text-muted-foreground block text-[11px]">Verification Integrity</span>
              <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>State Registry Verified (Active)</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-0 text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Lock className="h-3 w-3 text-muted-foreground/70" />
            <span>256-Bit Encrypted Session</span>
          </CardFooter>
        </Card>

        {/* Registry Status Metrics */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Document Registry Statistics
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time breakdown of all state document lodgements.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-md border border-border p-3 space-y-1">
                  <span className="text-[11px] text-muted-foreground block">Total Lodged</span>
                  <span className="text-xl font-semibold font-mono text-foreground" suppressHydrationWarning>
                    {mounted ? applications.length : 0}
                  </span>
                </div>

                <div className="rounded-md border border-border p-3 space-y-1">
                  <span className="text-[11px] text-muted-foreground block">Under Review</span>
                  <span className="text-xl font-semibold font-mono text-amber-600 dark:text-amber-400" suppressHydrationWarning>
                    {mounted ? underReviewCount : 0}
                  </span>
                </div>

                <div className="rounded-md border border-border p-3 space-y-1">
                  <span className="text-[11px] text-muted-foreground block">Ready for Collection</span>
                  <span className="text-xl font-semibold font-mono text-emerald-600 dark:text-emerald-400" suppressHydrationWarning>
                    {mounted ? readyCount : 0}
                  </span>
                </div>

                <div className="rounded-md border border-border p-3 space-y-1">
                  <span className="text-[11px] text-muted-foreground block">Submitted / Intake</span>
                  <span className="text-base font-semibold font-mono text-foreground" suppressHydrationWarning>
                    {mounted ? submittedCount : 0}
                  </span>
                </div>

                <div className="rounded-md border border-border p-3 space-y-1">
                  <span className="text-[11px] text-muted-foreground block">Accepted</span>
                  <span className="text-base font-semibold font-mono text-foreground" suppressHydrationWarning>
                    {mounted ? acceptedCount : 0}
                  </span>
                </div>

                <div className="rounded-md border border-border p-3 space-y-1">
                  <span className="text-[11px] text-muted-foreground block">Approved / Printing</span>
                  <span className="text-base font-semibold font-mono text-foreground" suppressHydrationWarning>
                    {mounted ? printingCount : 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Authority Guidance */}
          <div className="rounded-md border border-border bg-muted/30 p-4 text-xs space-y-1">
            <span className="font-medium text-foreground block">
              Statutory Transparency Notice
            </span>
            <p className="text-muted-foreground leading-relaxed">
              Every lodgement entered into GovTrace receives an immutable tracking identifier. Department officers are legally bound to document verification checkpoints within established state service level agreements.
            </p>
          </div>
        </div>
      </div>

      {/* Registered Applications Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Registered Applications
          </h2>
          <span className="text-xs text-muted-foreground" suppressHydrationWarning>
            {mounted ? `${applications.length} ${applications.length === 1 ? "record" : "records"} found` : "Loading records..."}
          </span>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Tracking ID</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Authority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Lodged</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!mounted ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-xs text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                    <span>Loading registry records...</span>
                  </TableCell>
                </TableRow>
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 space-y-3">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-foreground">
                        No applications registered yet
                      </p>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        You have not submitted any document requests. When you submit a request, it will appear here with live tracking.
                      </p>
                    </div>
                    <Link href="/apply">
                      <Button size="sm" variant="outline" className="h-8 text-xs font-normal">
                        Submit an Application
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
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

                    <TableCell className="font-medium text-foreground">
                      {app.documentType}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {app.departmentCode || "GOV"}
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>

                    <TableCell className="font-mono text-muted-foreground text-[11px]">
                      {formatDate(app.createdAt)}
                    </TableCell>

                    <TableCell className="text-right">
                      <Link href={`/track/${app.trackingId}`}>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          Inspect Dossier
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
