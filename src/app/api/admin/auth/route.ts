import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminPin,
  generateAdminToken,
  ADMIN_COOKIE_NAME,
  isAuthorizedAdmin,
} from "@/lib/serverDb";
import { ApiResponse } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// In-memory sliding window rate limiter for brute-force protection
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = failedAttempts.get(ip);
  if (!entry) return true;
  if (entry.lockedUntil > now) return false;
  if (entry.count >= 5) {
    entry.lockedUntil = now + 15 * 60 * 1000; // 15-minute lockout
    return false;
  }
  return true;
}

function recordFailure(ip: string): void {
  const entry = failedAttempts.get(ip) || { count: 0, lockedUntil: 0 };
  entry.count += 1;
  failedAttempts.set(ip, entry);
}

function clearFailures(ip: string): void {
  failedAttempts.delete(ip);
}

/**
 * GET /api/admin/auth
 * Checks if current request has a valid admin session cookie.
 */
export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authorized = isAuthorizedAdmin(cookie);
  return NextResponse.json<ApiResponse<{ authenticated: boolean }>>({
    success: true,
    data: { authenticated: authorized },
  });
}

/**
 * POST /api/admin/auth
 * Authenticates admin via PIN and sets HTTP-only session cookie.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(ip)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Too many failed attempts. Account temporarily locked for 15 minutes." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const pin = body?.pin;

    if (!pin || !verifyAdminPin(pin)) {
      recordFailure(ip);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Invalid Admin Passkey. Please verify your credentials." },
        { status: 401 }
      );
    }

    clearFailures(ip);
    const token = generateAdminToken();

    const response = NextResponse.json<ApiResponse<{ authenticated: boolean }>>({
      success: true,
      data: { authenticated: true },
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: unknown) {
    console.error("Error in admin auth:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Authentication system error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/auth
 * Logs out admin by clearing cookie.
 */
export async function DELETE() {
  const response = NextResponse.json<ApiResponse<null>>({
    success: true,
    data: null,
  });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
