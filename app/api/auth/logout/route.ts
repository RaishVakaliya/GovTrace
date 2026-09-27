import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  await clearSessionCookie();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  return NextResponse.redirect(new URL("/login", appUrl));
}

export async function GET(request: NextRequest) {
  await clearSessionCookie();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  return NextResponse.redirect(new URL("/login", appUrl));
}
