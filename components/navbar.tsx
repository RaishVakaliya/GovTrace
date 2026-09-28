"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthSession } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Shield,
  Search,
  FilePlus,
  LayoutDashboard,
  Building,
  User,
  LogOut,
  Menu,
  X,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

  const isOfficial = session?.role === "official";

  // Dynamic Navigation Links based on authenticated role
  const navLinks = isOfficial
    ? [
        { href: "/admin", label: "Official Queue", icon: Building },
        { href: "/", label: "Public Search", icon: Search },
        { href: "/profile", label: "Officer Profile", icon: User },
      ]
    : [
        { href: "/", label: "Track Document", icon: Search },
        { href: "/dashboard", label: "Citizen Hub", icon: LayoutDashboard },
        { href: "/apply", label: "New Application", icon: FilePlus },
      ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Official Brand Crest */}
        <div className="flex items-center gap-6">
          <Link href={isOfficial ? "/admin" : "/"} className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs">
              <Shield className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-foreground leading-none">
                GovTrace
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono pt-0.5">
                {isOfficial ? "Department Portal" : "Official Registry"}
              </span>
            </div>
          </Link>

          <Separator orientation="vertical" className="hidden h-4 md:block" />

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "h-8 gap-1.5 px-2.5 text-xs font-normal",
                      isActive
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{link.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Theme Toggle & User Auth */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />

          <Separator orientation="vertical" className="h-4" />

          {session ? (
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 gap-2 text-xs font-normal px-2.5",
                    pathname === "/profile"
                      ? "bg-secondary text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <User className="h-3.5 w-3.5" />
                  <span>{session.name}</span>
                  <Badge variant="outline" className="text-[10px] uppercase font-mono px-1.5 py-0">
                    {session.role}
                  </Badge>
                </Button>
              </Link>
              <a href="/api/auth/logout" title="Sign Out">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="outline" className="h-8 text-xs font-normal">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-8 w-8"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background px-4 py-3 md:hidden space-y-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs",
                  isActive
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <link.icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
            {session ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-foreground hover:underline flex items-center gap-1.5"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>{session.name} ({session.role})</span>
                </Link>
                <a href="/api/auth/logout" className="text-destructive hover:underline">
                  Logout
                </a>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
