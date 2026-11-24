import { NextRequest, NextResponse } from "next/server";
import {
  getStudentBookings,
  getStudentUserById,
  verifyStudentSessionToken,
  STUDENT_COOKIE_NAME,
} from "@/lib/serverDb";
import { ApiResponse, MentorshipSessionRecord } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/bookings/track
 * Returns scheduled mentorship sessions strictly for the authenticated student account.
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(STUDENT_COOKIE_NAME)?.value;
    const userId = verifyStudentSessionToken(token);
    if (!userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Please sign in to view your scheduled mentorship sessions" },
        { status: 401 }
      );
    }

    const student = await getStudentUserById(userId);
    if (!student) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Student session not found" },
        { status: 401 }
      );
    }

    const isDemo = student.id.startsWith("usr_demo_");
    const bookings = await getStudentBookings({
      userId: student.id,
      phone: isDemo ? student.parentPhone : undefined,
    });

    return NextResponse.json<ApiResponse<MentorshipSessionRecord[]>>({
      success: true,
      data: bookings,
      total: bookings.length,
    });
  } catch (err: unknown) {
    console.error("Error fetching student mentorship meetings:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Unable to retrieve scheduled meetings at this time" },
      { status: 500 }
    );
  }
}
