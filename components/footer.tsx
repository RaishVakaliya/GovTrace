import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, ExternalLink, HelpCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-base tracking-wide">
                GovTrace Public Infrastructure
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              GovTrace is a high-assurance, real-time tracking registry engineered
              for transparent government document workflows, citizen entitlement
              processing, and official inter-departmental verification.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 1.3 256-Bit Encrypted Official Transaction Pipeline</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Public Document Tracking
                </Link>
              </li>
              <li>
                <Link href="/apply" className="hover:text-white transition-colors">
                  Submit New Application
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  My Active Applications
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Document Retrieval Counters</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Authorities & Governance
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Department Officer Console
                </Link>
              </li>
              <li>
                <a
                  href="/api/auth/dev-login?role=official"
                  className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                >
                  <span>Official Access Login</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="text-slate-500">Security Audit Logs</span>
              </li>
              <li>
                <span className="text-slate-500">Public Records Policy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GovTrace Authority. All state rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Powered by Next.js App Router, Convex Real-time Sync, Passport.js OAuth & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
