import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth/session";
import { AuthSession } from "@/types";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  if (error || !code) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error || "No code provided")}`, appUrl)
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  try {
    // Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId || "",
        client_secret: clientSecret || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Google token exchange error:", tokenData);
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", appUrl));
    }

    // Fetch user info from Google
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userRes.json();
    const email = userData.email || "";
    const name = userData.name || "Google Citizen";
    const image = userData.picture;

    // Determine role: official if email domain indicates official government or contains official
    const isOfficial =
      email.endsWith(".gov") ||
      email.endsWith(".gov.in") ||
      email.endsWith("@govtrace.internal") ||
      email.includes("official");

    const session: AuthSession = {
      userId: `google_${userData.id}`,
      name,
      email,
      image,
      role: isOfficial ? "official" : "citizen",
    };

    // 1. Persist authenticated session cookie
    await setSessionCookie(session);

    // 2. Sync user directly to Convex database
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (convexUrl) {
      try {
        const convex = new ConvexHttpClient(convexUrl);
        await convex.mutation(api.users.upsertUser, {
          name,
          email,
          image: image || undefined,
          role: isOfficial ? "official" : "citizen",
        });
        console.log(`[Convex Sync] User ${email} synchronized to Convex successfully.`);
      } catch (convexErr) {
        console.error("[Convex Sync Error] Failed to upsert user into Convex:", convexErr);
      }
    } else {
      console.warn("[Convex Sync Warning] NEXT_PUBLIC_CONVEX_URL is not set in .env.local.");
    }

    // Redirect based on role
    const destination = isOfficial ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(destination, appUrl));
  } catch (err) {
    console.error("OAuth callback exception:", err);
    return NextResponse.redirect(new URL("/login?error=oauth_internal_error", appUrl));
  }
}
