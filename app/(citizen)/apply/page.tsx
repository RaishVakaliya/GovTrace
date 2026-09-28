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
import { Check, Loader2, ArrowRight, Lock, ShieldCheck, ShieldAlert, Building } from "lucide-react";

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
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantIdNumber, setApplicantIdNumber] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedTrackingId, setGeneratedTrackingId] = useState<string | null>(null);

  // Authenticated state & lock
  const [sessionUserId, setSessionUserId] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [isEmailLocked, setIsEmailLocked] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setApplicantName(data.user.name || "");
          setApplicantEmail(data.user.email || "");
          setSessionUserId(data.user.userId || "");
          setUserRole(data.user.role || "");
          if (data.user.email) {
            setIsEmailLocked(true);
          }
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    const docs = DEPARTMENT_DOCUMENTS[selectedDeptId] || [];
    if (docs.length > 0) {
      setSelectedDocType(docs[0]);
    }
  }, [selectedDeptId]);

  // Strict Permission Check: Department Officials CANNOT lodge citizen applications
  if (userRole === "official") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-foreground mx-auto">
          <ShieldAlert className="h-6 w-6 text-foreground" />
        </div>
        <div className="space-y-1">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Access Restricted: Official Account
          </h1>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Department Officials do not have permission to request or lodge citizen documents. Your account is authorized exclusively for adjudication and queue verification.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/admin">
            <Button size="sm" className="h-8 gap-1.5 text-xs font-normal">
              <Building className="h-3.5 w-3.5" />
              <span>Return to Official Console</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail || !selectedDocType) return;

    setIsSubmitting(true);
    try {
      const res = createApplication({
        userId: sessionUserId || "citizen-" + Date.now(),
        applicantName,
        applicantEmail, // Strictly verified email
        applicantIdNumber,
        departmentId: selectedDeptId,
        documentType: selectedDocType,
        remarks: remarks || "Official application lodged via Citizen Gateway.",
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
            <BreadcrumbPage>New Application</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Lodge Document Application
        </h1>
        <p className="text-sm text-muted-foreground">
          Official statutory submission gateway for civil, licensing, and deed records.
        </p>
      </div>

      {generatedTrackingId ? (
        <Card className="text-center p-8 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground mx-auto">
            <Check className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-foreground">
              Application Lodged in State Registry
            </h2>
            <p className="text-xs text-muted-foreground">
              Your tracking reference has been created and indexed with live Convex status streaming.
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
                    Applicant Full Legal Name
                  </label>
                  <Input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Enter full legal name"
                    className="h-9 text-xs"
                  />
                </div>

                {/* Email Field - Immutable and Locked */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-foreground block">
                      Official Email
                    </label>
                    {isEmailLocked && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                        <Lock className="h-2.5 w-2.5 text-muted-foreground" />
                        Locked (Identity Verified)
                      </span>
                    )}
                  </div>
                  <Input
                    type="email"
                    required
                    value={applicantEmail}
                    readOnly={isEmailLocked}
                    onChange={(e) => {
                      if (!isEmailLocked) {
                        setApplicantEmail(e.target.value);
                      }
                    }}
                    placeholder="name@example.com"
                    className={`h-9 text-xs ${isEmailLocked
                        ? "bg-muted/50 text-muted-foreground cursor-not-allowed select-none border-input/60"
                        : ""
                      }`}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    {isEmailLocked
                      ? "Email is authenticated via your verified Google session and cannot be modified."
                      : "Enter the email where official adjudication updates will be sent."}
                  </p>
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
                    placeholder="e.g. NAT-19284-B"
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

              <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 p-2.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-foreground/70 shrink-0" />
                <span>
                  Official Submission Integrity: Your identity, email, and document payload are logged with statutory audit logging.
                </span>
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
