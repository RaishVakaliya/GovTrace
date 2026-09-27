"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthSession } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Search,
  FilePlus2,
  LayoutDashboard,
  Building,
  LogOut,
  UserCheck,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setSession(data.user);
        }
      })
      .catch(() => {});
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      {/* Top Government Banner */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          <span>Official Public Services & Document Processing Network</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">
            Real-Time State Tracking Registry
          </span>
          <div className="ml-auto flex items-center space-x-3 text-[11px]">
            <span className="text-slate-400 hidden md:inline">Demo Switcher:</span>
            <a
              href="/api/auth/dev-login?role=citizen"
              className="text-blue-300 hover:text-white underline-offset-2 hover:underline"
            >
              Citizen Mode
            </a>
            <span className="text-slate-600">/</span>
            <a
              href="/api/auth/dev-login?role=official"
              className="text-amber-300 hover:text-white underline-offset-2 hover:underline"
            >
              Official (Admin) Mode
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Crest */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-md shadow-blue-900/20 group-hover:bg-blue-800 transition-colors">
            <ShieldCheck className="w-6 h-6 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                GovTrace
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 uppercase tracking-wider">
                Live
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 tracking-tight">
              State Document Process Tracking
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
          <Link
            href="/"
            className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1.5 ${
              pathname === "/"
                ? "bg-slate-100 text-blue-900 dark:bg-slate-800 dark:text-blue-400"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Public Tracking</span>
          </Link>

          <Link
            href="/dashboard"
            className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1.5 ${
              pathname.startsWith("/dashboard")
                ? "bg-slate-100 text-blue-900 dark:bg-slate-800 dark:text-blue-400"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Citizen Portal</span>
          </Link>

          <Link
            href="/apply"
            className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1.5 ${
              pathname.startsWith("/apply")
                ? "bg-slate-100 text-blue-900 dark:bg-slate-800 dark:text-blue-400"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <FilePlus2 className="w-4 h-4" />
            <span>Apply Online</span>
          </Link>

          <Link
            href="/admin"
            className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1.5 ${
              pathname.startsWith("/admin")
                ? "bg-slate-100 text-blue-900 dark:bg-slate-800 dark:text-blue-400"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Department Official</span>
          </Link>
        </nav>

        {/* User Account / Auth Section */}
        <div className="hidden md:flex items-center space-x-3">
          {session ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                {session.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.image}
                    alt={session.name}
                    className="w-8 h-8 rounded-full border border-slate-300 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                    {session.name.charAt(0)}
                  </div>
                )}
                <div className="text-left">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-[120px]">
                      {session.name}
                    </span>
                    <Badge
                      variant={session.role === "official" ? "review" : "accepted"}
                      className="text-[10px] py-0 px-1.5 uppercase font-mono"
                    >
                      {session.role}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 max-w-[120px]">
                    {session.email}
                  </p>
                </div>
              </div>

              <a
                href="/api/auth/logout"
                className="text-slate-400 hover:text-red-600 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button size="sm" variant="default" className="text-xs font-semibold shadow-sm">
                  Sign In with Google
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 space-y-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200"
          >
            Public Tracking
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200"
          >
            Citizen Portal
          </Link>
          <Link
            href="/apply"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200"
          >
            Apply Online
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200"
          >
            Department Official Console
          </Link>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-2">
            {session ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold">{session.name}</p>
                  <p className="text-[11px] text-slate-500">{session.email}</p>
                </div>
                <a
                  href="/api/auth/logout"
                  className="text-xs text-red-600 font-medium flex items-center"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1" /> Sign Out
                </a>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full">
                  Sign In with Google
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
