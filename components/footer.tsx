import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background text-muted-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-foreground/80" />
            <span className="font-medium text-foreground">GovTrace</span>
            <span className="text-muted-foreground/60">—</span>
            <span>State Document Tracking Infrastructure</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/" className="hover:text-foreground transition-colors">
              Public Search
            </Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Citizen Hub
            </Link>
            <Link href="/admin" className="hover:text-foreground transition-colors">
              Official Console
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
