"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, UserCheck, Building2, AlertCircle, Info, Lock } from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const notice = searchParams.get("notice");
  const error = searchParams.get("error");

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-900/30">
            <ShieldCheck className="w-7 h-7 text-blue-200" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            GovTrace Access Portal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Secure Federated Single Sign-On for Citizens & Department Officials
          </p>
        </div>

        {/* Notice/Alert if Google keys aren't set */}
        {notice === "credentials_required" && (
          <div className="p-3.5 rounded-lg border border-amber-300 bg-amber-50 dark:border-amber-900/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Google OAuth Notice:</p>
              <p className="mt-0.5 text-amber-800 dark:text-amber-300">
                To connect live Google authentication, configure <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">GOOGLE_CLIENT_ID</code> and <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">GOOGLE_CLIENT_SECRET</code> in <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">.env.local</code>.
                In the meantime, you can use the instant one-click test logins below!
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-lg border border-red-300 bg-red-50 dark:border-red-900/80 dark:bg-red-950/40 text-red-900 dark:text-red-200 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Authentication Error:</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Main Sign In Card */}
        <Card className="shadow-xl border-slate-200 dark:border-slate-800">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg">Sign In to GovTrace</CardTitle>
            <CardDescription className="text-xs">
              Authenticate via Google OAuth 2.0 Identity Provider
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Primary Google Sign In Button */}
            <a href="/api/auth/google" className="block w-full">
              <Button
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center space-x-3 border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 text-sm font-semibold shadow-sm h-12"
              >
                {/* Official Google 'G' SVG Logo */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </Button>
            </a>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold absolute">
                Instant Demo Access
              </span>
            </div>

            {/* Quick Demo Login Buttons */}
            <div className="space-y-2">
              <a href="/api/auth/dev-login?role=citizen" className="block w-full">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full text-xs font-semibold flex items-center justify-between h-10 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>Citizen Demo (Elena Rostova)</span>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 px-1.5 py-0.5 rounded">
                    /dashboard
                  </span>
                </Button>
              </a>

              <a href="/api/auth/dev-login?role=official" className="block w-full">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full text-xs font-semibold flex items-center justify-between h-10 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <span>Department Official (Officer Vance)</span>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 px-1.5 py-0.5 rounded">
                    /admin
                  </span>
                </Button>
              </a>
            </div>
          </CardContent>

          <CardFooter className="pt-0 flex flex-col space-y-2 text-center">
            <p className="text-[11px] text-slate-400">
              Role-Based Routing: Citizen accounts are routed to{" "}
              <code className="text-slate-600 dark:text-slate-300 font-mono">/dashboard</code>.
              Official accounts (.gov emails) are routed to{" "}
              <code className="text-slate-600 dark:text-slate-300 font-mono">/admin</code>.
            </p>
            <div className="flex items-center justify-center space-x-1 text-[11px] text-slate-500">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>TLS Protected Identity Exchange</span>
            </div>
          </CardFooter>
        </Card>

        {/* Public Search Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium underline-offset-4 hover:underline"
          >
            ← Return to Public Tracking Search
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-slate-500">Loading access portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
