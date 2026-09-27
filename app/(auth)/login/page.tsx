"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, Lock } from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const notice = searchParams.get("notice");
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-4">
        {/* Brand header */}
        <div className="text-center space-y-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground mx-auto mb-2">
            <Shield className="h-4 w-4" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Sign In to GovTrace
          </h1>
          <p className="text-xs text-muted-foreground">
            Official Citizen & Department Identity Gateway
          </p>
        </div>

        {/* Notices */}
        {notice === "credentials_required" && (
          <div className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
            <span className="font-medium text-foreground block">
              Google OAuth Setup Required
            </span>
            <p>
              To authenticate with your Google account, configure <code className="font-mono text-[11px] text-foreground">GOOGLE_CLIENT_ID</code> and <code className="font-mono text-[11px] text-foreground">GOOGLE_CLIENT_SECRET</code> in <code className="font-mono text-[11px] text-foreground">.env.local</code>.
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            {error}
          </div>
        )}

        {/* Auth Card */}
        <Card>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-sm font-semibold">Federated Authentication</CardTitle>
            <CardDescription className="text-xs">
              Single Sign-On for citizen lodgements and official queue access
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-2 space-y-4">
            {/* Google OAuth Button */}
            <a href="/api/auth/google" className="block w-full">
              <Button variant="outline" className="w-full h-9 text-xs font-normal gap-2.5">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
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
                <span>Sign in with Google</span>
              </Button>
            </a>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
              <Lock className="h-3 w-3 text-muted-foreground/70" />
              <span>TLS 1.3 State Encrypted Channel</span>
            </div>
          </CardContent>

          <CardFooter className="pt-0 justify-center">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Public Search</span>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-xs text-muted-foreground">Loading access portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
