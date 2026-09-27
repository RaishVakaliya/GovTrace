"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useGovStore } from "@/components/providers/convex-client-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Check, Loader2, ArrowRight } from "lucide-react";

const DEPARTMENT_DOCUMENTS: Record<string, string[]> = {
  "dept-1": [
    "Biometric Passport Renewal (10-Year)",
    "National Identity Smart Card (e-ID)",
    "Certified Birth Record Extract",
    "Certificate of Consular Citizenship",
  ],
  "dept-2": [
    "Commercial Driver License Class A",
    "Private Operator Vehicle License Endorsement",
    "Electronic Vehicle Title Registration",
    "International Driving Transit Permit",
  ],
  "dept-3": [
    "Residential Title Deed Transfer & Registration",
    "Cadastral Boundary Survey Certification",
    "Property Encumbrance Clearance Certificate",
    "Municipal Land Valuation Assessment",
  ],
  "dept-4": [
    "Municipal Commercial Trading Permit",
    "Corporate Articles of Incorporation",
    "Harmonized Import/Export Commodity License",
    "Directorate Annual Business Compliance Filings",
  ],
};

export default function ApplyPage() {
  const { departments, createApplication } = useGovStore();

  const [selectedDeptId, setSelectedDeptId] = useState("dept-1");
  const [selectedDocType, setSelectedDocType] = useState("");
  const [applicantName, setApplicantName] = useState("Elena Rostova");
  const [applicantEmail, setApplicantEmail] = useState("elena.rostova@example.gov");
  const [applicantIdNumber, setApplicantIdNumber] = useState("NAT-77492-X");
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedTrackingId, setGeneratedTrackingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setApplicantName(data.user.name || "Elena Rostova");
          setApplicantEmail(data.user.email || "elena.rostova@example.gov");
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const docs = DEPARTMENT_DOCUMENTS[selectedDeptId] || [];
    if (docs.length > 0) {
      setSelectedDocType(docs[0]);
    }
  }, [selectedDeptId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail || !selectedDocType) return;

    setIsSubmitting(true);
    try {
      const res = createApplication({
        userId: "demo-citizen-1",
        applicantName,
        applicantEmail,
        applicantIdNumber,
        departmentId: selectedDeptId,
        documentType: selectedDocType,
        remarks: remarks || "Application lodged via Citizen Portal.",
      });

      setGeneratedTrackingId(res.trackingId);
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 space-y-6">
      {/* Breadcrumbs */}
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
            <BreadcrumbPage>New Request</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Lodge Document Application
        </h1>
        <p className="text-sm text-muted-foreground">
          Submit official request for civil, licensing, or property records.
        </p>
      </div>

      {generatedTrackingId ? (
        <Card className="text-center p-8 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground mx-auto">
            <Check className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-foreground">
              Application Successfully Lodged
            </h2>
            <p className="text-xs text-muted-foreground">
              Your tracking reference has been created and indexed in the state registry.
            </p>
          </div>

          <div className="rounded-md border border-border bg-muted/40 p-3 max-w-xs mx-auto">
            <span className="text-[11px] text-muted-foreground block">Reference ID</span>
            <span className="font-mono text-base font-semibold text-foreground">
              {generatedTrackingId}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href={`/track/${generatedTrackingId}`}>
              <Button size="sm" className="h-8 text-xs font-normal">
                <span>View Status Stepper</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="h-8 text-xs font-normal">
                Return to Hub
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold">
                Application Specifications
              </CardTitle>
              <CardDescription className="text-xs">
                Select target authority and verify applicant details.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground block">
                    Target Department
                  </label>
                  <Select
                    value={selectedDeptId}
                    onChange={(e) => setSelectedDeptId(e.target.value)}
                    className="h-9 text-xs"
                  >
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground block">
                    Document Type
                  </label>
                  <Select
                    value={selectedDocType}
                    onChange={(e) => setSelectedDocType(e.target.value)}
                    className="h-9 text-xs"
                  >
                    {(DEPARTMENT_DOCUMENTS[selectedDeptId] || []).map((doc) => (
                      <option key={doc} value={doc}>
                        {doc}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground block">
                    Applicant Full Name
                  </label>
                  <Input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground block">
                    Official Email
                  </label>
                  <Input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-medium text-foreground block">
                    National ID / Reference Number
                  </label>
                  <Input
                    type="text"
                    required
                    value={applicantIdNumber}
                    onChange={(e) => setApplicantIdNumber(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border">
                <label className="text-xs font-medium text-foreground block">
                  Remarks / Supporting Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Specify any relevant application notes..."
                  className="w-full text-xs rounded-md border border-input bg-background p-2.5 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border p-4">
              <Link href="/dashboard">
                <Button type="button" variant="outline" size="sm" className="h-8 text-xs font-normal">
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-8 text-xs font-normal"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}
