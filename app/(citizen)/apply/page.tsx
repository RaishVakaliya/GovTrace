"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGovStore } from "@/components/providers/convex-client-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  FilePlus2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Building2,
  FileText,
  User,
  Mail,
  CreditCard,
  Loader2,
} from "lucide-react";

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
  const router = useRouter();
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

  // Update document type when department changes
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
      console.error("Application submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <FilePlus2 className="w-6 h-6 text-blue-700 dark:text-blue-400" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Apply for Official State Document
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Electronic submission gateway. Once submitted, your request is cryptographically indexed and can be tracked in real time.
        </p>
      </div>

      {generatedTrackingId ? (
        <Card className="border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
          <div className="bg-emerald-600 text-white p-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 mx-auto" />
            <h2 className="text-xl font-bold">Application Lodged Successfully!</h2>
            <p className="text-xs text-emerald-100 max-w-md mx-auto">
              Your document request has been received by the target department and logged into the Convex real-time audit ledger.
            </p>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6 text-center">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 max-w-sm mx-auto">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                Your Unique Tracking ID
              </span>
              <span className="font-mono text-2xl font-black text-blue-900 dark:text-blue-300 tracking-wider">
                {generatedTrackingId}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={`/track/${generatedTrackingId}`}>
                <Button size="lg" className="w-full sm:w-auto text-xs font-semibold">
                  <span>View Live Tracking Stepper</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-xs font-semibold">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
          <form onSubmit={handleSubmit}>
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="text-base">Document Application Form</CardTitle>
              <CardDescription className="text-xs">
                Fill in the verified applicant and target administrative details below.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-5">
              {/* Department & Document Type Selection */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                  <Building2 className="w-3.5 h-3.5 mr-1.5" />
                  1. Administrative Routing
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      Target Department:
                    </label>
                    <Select
                      value={selectedDeptId}
                      onChange={(e) => setSelectedDeptId(e.target.value)}
                      className="text-xs"
                    >
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      Document Type:
                    </label>
                    <Select
                      value={selectedDocType}
                      onChange={(e) => setSelectedDocType(e.target.value)}
                      className="text-xs"
                    >
                      {(DEPARTMENT_DOCUMENTS[selectedDeptId] || []).map((doc) => (
                        <option key={doc} value={doc}>
                          {doc}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              {/* Applicant Personal Credentials */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5" />
                  2. Applicant Credentials
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      Full Legal Name:
                    </label>
                    <Input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      Official Contact Email:
                    </label>
                    <Input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="name@example.gov"
                      className="text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      National Identity / Passport / Aadhaar Reference:
                    </label>
                    <Input
                      type="text"
                      required
                      value={applicantIdNumber}
                      onChange={(e) => setApplicantIdNumber(e.target.value)}
                      placeholder="e.g. NAT-77492-X"
                      className="text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Statement / Remarks */}
              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Additional Notes or Supporting Remarks (Optional):
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Include any specific details, previous document serial numbers, or urgent requirements..."
                  className="w-full text-xs rounded-md border border-slate-300 bg-white p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Security Statement */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900 text-[11px] text-blue-800 dark:text-blue-300 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                <span>
                  By submitting this form, you certify under penalty of law that the information provided is accurate and verifiable.
                </span>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between p-4">
              <Link href="/dashboard">
                <Button type="button" variant="outline" size="sm" className="text-xs">
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="text-xs font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <span>Submit Application & Generate Tracking ID</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}
