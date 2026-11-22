import { NextRequest, NextResponse } from "next/server";
import { getStudentBookings } from "@/lib/serverDb";
import { ApiResponse, MentorshipSessionRecord } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/bookings/track
 * Allows students and parents to track the real-time status of their booked mentorship sessions
 * using either their Booking Reference ID (e.g., "bk_9395d0eb") or their 10-digit mobile number.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim() || "";
    const id = searchParams.get("id")?.trim() || "";
    const phone = searchParams.get("phone")?.trim() || "";

    const searchTerm = id || query;

    if (!searchTerm && !phone) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Please enter a Booking Reference ID or 10-digit mobile number" },
        { status: 400 }
      );
    }

    // Determine if search term is an ID or Phone
    const isId = searchTerm.startsWith("bk_") || searchTerm.startsWith("BK-") || searchTerm.startsWith("BK_");
    const cleanPhone = phone || (!isId ? searchTerm.replace(/[^0-9]/g, "").slice(-10) : "");

    const bookings = await getStudentBookings({
      bookingId: isId ? searchTerm : undefined,
      phone: cleanPhone || undefined,
    });

    if (!bookings || bookings.length === 0) {
      return NextResponse.json<ApiResponse<MentorshipSessionRecord[]>>(
        {
          success: true,
          data: [],
          total: 0,
        },
        { status: 200 }
      );
    }

    return NextResponse.json<ApiResponse<MentorshipSessionRecord[]>>({
      success: true,
      data: bookings,
      total: bookings.length,
    });
  } catch (err: unknown) {
    console.error("Error tracking mentorship booking:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Unable to retrieve booking status at this time" },
      { status: 500 }
    );
  }
}
