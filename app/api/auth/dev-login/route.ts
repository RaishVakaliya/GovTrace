import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth/session";
import { AuthSession } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") || "citizen";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  let session: AuthSession;

  if (role === "official") {
    session = {
      userId: "demo-official-1",
      name: "Officer Sarah Vance",
      email: "sarah.vance@dscr.gov",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      role: "official",
    };
  } else {
    session = {
      userId: "demo-citizen-1",
      name: "Elena Rostova",
      email: "elena.rostova@example.gov",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      role: "citizen",
    };
  }

  await setSessionCookie(session);

  const destination = session.role === "official" ? "/admin" : "/dashboard";
  return NextResponse.redirect(new URL(destination, appUrl));
}

export async function POST(request: NextRequest) {
  return GET(request);
}
