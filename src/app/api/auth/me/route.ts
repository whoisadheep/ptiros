import { NextRequest, NextResponse } from "next/server";
import {
  STUDENT_COOKIE_NAME,
  verifyStudentSessionToken,
  getStudentPortalData,
} from "@/lib/serverDb";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(STUDENT_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    const userId = verifyStudentSessionToken(token);
    if (!userId) {
      return NextResponse.json({ authenticated: false });
    }

    const portalData = await getStudentPortalData(userId);
    if (!portalData) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      data: portalData,
    });
  } catch (error: any) {
    console.error("Auth me check error:", error);
    return NextResponse.json(
      { authenticated: false, error: "Failed to authenticate session" },
      { status: 500 }
    );
  }
}
