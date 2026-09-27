"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGovStore } from "@/components/providers/convex-client-provider";
import { StatusBadge } from "@/components/status-badge";
import { StatusStepper } from "@/components/status-stepper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Search,
  FileText,
  ArrowUpRight,
  Shield,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  const { getByTrackingId } = useGovStore();
  const [searchInput, setSearchInput] = useState("");
  const [searchedId, setSearchedId] = useState<string | null>(null);

  const trackingResult = searchedId ? getByTrackingId(searchedId) : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearchedId(searchInput.trim());
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 space-y-12">
      {/* Official Registry Hero Section */}
      <section className="text-center space-y-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5">
          <Badge variant="outline" className="font-normal text-xs text-muted-foreground gap-1.5">
            <Shield className="h-3 w-3 text-muted-foreground" />
            <span>State Document Tracking & Verification Infrastructure</span>
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground max-w-2xl mx-auto">
          Public Document Process Tracking Registry
        </h1>

        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Enter your official government tracking reference ID below to inspect live verification checkpoints, officer adjudications, and counter collection notices.
        </p>

        {/* Minimal Search Bar */}
        <div className="max-w-md mx-auto pt-2">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Reference ID (e.g. GT-2026-XXXXX)"
                className="pl-9 h-9 text-xs font-mono"
              />
            </div>
            <Button type="submit" size="sm" className="h-9 text-xs px-4">
              Track
            </Button>
          </form>

          <p className="text-[11px] text-muted-foreground mt-2">
            Reference IDs are provided on your submission slip or official email acknowledgment.
          </p>
        </div>
      </section>

      {/* Real-time Tracking Result Section */}
      <section className="max-w-3xl mx-auto">
        {trackingResult ? (
          <Card>
            <CardHeader className="border-b border-border pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-semibold text-foreground">
                      {trackingResult.trackingId}
                    </span>
                    <StatusBadge status={trackingResult.status} />
                  </div>
                  <CardDescription className="text-xs">
                    Lodged {formatDate(trackingResult.createdAt)} • {trackingResult.documentType}
                  </CardDescription>
                </div>

                <div className="text-xs text-muted-foreground">
                  Authority: <span className="font-medium text-foreground">{trackingResult.department?.name || trackingResult.departmentName || "State Authority"}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Stepper */}
              <StatusStepper
                currentStatus={trackingResult.status}
                statusLogs={trackingResult.statusLogs}
                orientation="horizontal"
                showLogDetails={true}
              />

              {/* Status Note */}
              {trackingResult.remarks && (
                <div className="rounded-md border border-border bg-muted/30 p-3 text-xs">
                  <span className="font-medium text-foreground block mb-0.5">
                    Official Notice
                  </span>
                  <p className="text-muted-foreground">
                    {trackingResult.remarks}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : searchedId ? (
          <Card className="text-center p-8 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground mx-auto">
              <AlertCircle className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              No Record Found for &quot;{searchedId}&quot;
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              We could not locate any active or archived document record for this reference. Please check your reference format or submit a new application.
            </p>
            <div className="pt-2">
              <Link href="/apply">
                <Button size="sm" variant="outline" className="h-8 text-xs font-normal">
                  Submit an Application
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          /* Default Empty State guidance */
          <Card className="border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-foreground shrink-0">
                <HelpCircle className="h-4 w-4" />
              </div>
              <div className="space-y-1 text-xs">
                <span className="font-medium text-foreground block">
                  How Public Document Tracking Works
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  When you lodge an application through the Citizen Gateway or at any regional state office, a unique tracking identifier (starting with <code className="font-mono text-foreground font-semibold">GT-</code>) is automatically generated. Enter that reference above to view the live multi-stage adjudication process.
                </p>
                <div className="pt-2">
                  <Link href="/apply" className="text-foreground hover:underline font-medium flex items-center gap-1">
                    <span>Lodge a new official document request</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        )}
      </section>

      {/* Official State Pathways */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <Link href="/dashboard" className="group">
          <Card className="h-full transition-colors hover:border-foreground/30">
            <CardHeader className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Citizen Hub</CardTitle>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
              </div>
              <CardDescription className="text-xs">
                View, monitor, and print receipts for all documents registered under your verified profile.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/apply" className="group">
          <Card className="h-full transition-colors hover:border-foreground/30">
            <CardHeader className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">New Application</CardTitle>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
              </div>
              <CardDescription className="text-xs">
                Submit an official request for passport renewal, transport licenses, or property deeds.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/profile" className="group">
          <Card className="h-full transition-colors hover:border-foreground/30">
            <CardHeader className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Registry Profile</CardTitle>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
              </div>
              <CardDescription className="text-xs">
                Review verified citizen identity status, security credentials, and document volume statistics.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </section>
    </div>
  );
}
