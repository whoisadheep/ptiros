import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  upsertGoogleStudentUser,
  createStudentSessionToken,
  STUDENT_COOKIE_NAME,
} from "@/lib/serverDb";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?error=google_not_configured", origin));
  }

  const code = req.nextUrl.searchParams.get("code");
  const stateParam = req.nextUrl.searchParams.get("state");
  const stateCookie = req.cookies.get("ptiros_oauth_state")?.value;

  if (!code || !stateParam || !stateCookie) {
    return NextResponse.redirect(new URL("/login?error=google_auth_failed", origin));
  }

  let parsedState: { state: string; next?: string } | null = null;
  try {
    parsedState = JSON.parse(stateCookie);
  } catch {
    return NextResponse.redirect(new URL("/login?error=google_auth_failed", origin));
  }

  const a = Buffer.from(stateParam);
  const b = Buffer.from(parsedState?.state || "");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.redirect(new URL("/login?error=google_state_mismatch", origin));
  }

  try {
    const redirectUri = `${origin}/api/auth/google/callback`;
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL("/login?error=google_token_error", origin));
    }

    const tokenData = await tokenRes.json();
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userInfoRes.ok) {
      return NextResponse.redirect(new URL("/login?error=google_profile_error", origin));
    }

    const profile = await userInfoRes.json();
    if (!profile.sub || !profile.email) {
      return NextResponse.redirect(new URL("/login?error=google_profile_incomplete", origin));
    }

    const { user, isNew } = await upsertGoogleStudentUser({
      googleId: String(profile.sub),
      email: String(profile.email),
      name: String(profile.name || ""),
    });

    const targetPath =
      parsedState?.next && parsedState.next.startsWith("/")
        ? parsedState.next
        : isNew
        ? "/dashboard?tab=details&welcome=google"
        : "/dashboard";

    const sessionToken = createStudentSessionToken(user.id);
    const res = NextResponse.redirect(new URL(targetPath, origin));
    res.cookies.delete("ptiros_oauth_state");
    res.cookies.set({
      name: STUDENT_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });
    return res;
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(new URL("/login?error=google_auth_failed", origin));
  }
}
