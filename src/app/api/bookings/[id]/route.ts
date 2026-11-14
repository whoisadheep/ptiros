import { NextRequest, NextResponse } from "next/server";
import {
  updateBookingStatus,
  isAuthorizedAdmin,
  ADMIN_COOKIE_NAME,
} from "@/lib/serverDb";
import { ApiResponse, MentorshipSessionRecord, BookingStatus } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const headerKey = req.headers.get("x-admin-key");

    if (!isAuthorizedAdmin(cookie, headerKey)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await req.json();

    if (!id || !body.status) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Booking ID and status are required" },
        { status: 400 }
      );
    }

    const updated = await updateBookingStatus(
      id,
      body.status as BookingStatus,
      body.meetingLink,
      body.adminNotes
    );

    if (!updated) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Booking record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<MentorshipSessionRecord>>({
      success: true,
      data: updated,
    });
  } catch (err: unknown) {
    console.error("Error updating booking:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
