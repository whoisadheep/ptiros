import { NextRequest, NextResponse } from "next/server";
import {
  saveBooking,
  getDatabase,
  isAuthorizedAdmin,
  ADMIN_COOKIE_NAME,
  normalizeIndianMobile,
} from "@/lib/serverDb";
import { ApiResponse, MentorshipSessionRecord } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/bookings
 * Schedules a 20-min 1-on-1 Gurukul mentorship session.
 */
export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(req.headers.get("content-length") || "0");
    if (contentLength > 16384) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Payload too large" },
        { status: 413 }
      );
    }

    const body = await req.json();

    if (!body.mentorId || !body.date || !body.timeSlot || !body.studentName || !body.parentPhone) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Missing required booking details (mentor, date, slot, student name, phone)" },
        { status: 400 }
      );
    }

    const phoneCheck = normalizeIndianMobile(body.parentPhone);
    if (!phoneCheck.isValid) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Please enter a valid 10-digit Indian WhatsApp number" },
        { status: 400 }
      );
    }

    const result = await saveBooking({
      mentorId: body.mentorId,
      mentorName: body.mentorName || "Domain Specialist",
      domainTitle: body.domainTitle || "Career Strategy",
      studentName: String(body.studentName).slice(0, 100).trim(),
      parentPhone: phoneCheck.normalized,
      date: body.date,
      timeSlot: body.timeSlot,
      primaryQuestion: String(body.primaryQuestion || "General stream & career advisory").slice(0, 1000).trim(),
    });

    if (result.conflict) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "This slot is already reserved with this mentor. Please choose another slot or date." },
        { status: 409 }
      );
    }

    return NextResponse.json<ApiResponse<MentorshipSessionRecord>>(
      { success: true, data: result.booking! },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Error creating mentorship booking:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to schedule mentorship appointment" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings
 * Retrieves the mentorship appointments queue (Admin only).
 */
export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const headerKey = req.headers.get("x-admin-key");

    if (!isAuthorizedAdmin(cookie, headerKey)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const mentorId = searchParams.get("mentorId");

    const store = await getDatabase();
    let bookings = store.bookings;

    if (status && status !== "all") {
      bookings = bookings.filter((b) => b.status === status);
    }
    if (mentorId && mentorId !== "all") {
      bookings = bookings.filter((b) => b.mentorId === mentorId);
    }

    return NextResponse.json<ApiResponse<MentorshipSessionRecord[]>>({
      success: true,
      data: bookings,
      total: bookings.length,
    });
  } catch (err: unknown) {
    console.error("Error fetching bookings:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
