import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return NextResponse.json({
      synced: false,
      message: "NEXT_PUBLIC_CONVEX_URL is not configured in .env.local",
    });
  }

  try {
    const convex = new ConvexHttpClient(convexUrl);
    const userId = await convex.mutation(api.users.upsertUser, {
      name: session.name,
      email: session.email,
      image: session.image || undefined,
      role: session.role,
    });

    return NextResponse.json({
      synced: true,
      convexUserId: userId,
      user: session,
    });
  } catch (err: any) {
    console.error("Failed to sync user to Convex:", err);
    return NextResponse.json(
      { synced: false, error: err.message || "Convex sync failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
