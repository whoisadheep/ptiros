import { NextRequest, NextResponse } from "next/server";
import {
  STUDENT_COOKIE_NAME,
  verifyStudentSessionToken,
  addStudentSimResult,
} from "@/lib/serverDb";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(STUDENT_COOKIE_NAME)?.value;
    const userId = verifyStudentSessionToken(token);

    const body = await req.json();
    const { trackId, trackTitle, fitScore, resiliencePoints, badgeEarned } = body;

    if (!trackId || !trackTitle || typeof fitScore !== "number") {
      return NextResponse.json(
        { success: false, error: "trackId, trackTitle, and numeric fitScore are required" },
        { status: 400 }
      );
    }

    const simRecord = await addStudentSimResult(userId || "guest_student", {
      trackId: String(trackId),
      trackTitle: String(trackTitle),
      fitScore: Math.round(fitScore),
      resiliencePoints: Number(resiliencePoints) || 0,
      badgeEarned: badgeEarned ? String(badgeEarned) : undefined,
    });

    return NextResponse.json({
      success: true,
      simulation: simRecord,
      authenticated: Boolean(userId),
    });
  } catch (error: any) {
    console.error("Simulation save error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record simulation result" },
      { status: 500 }
    );
  }
}
