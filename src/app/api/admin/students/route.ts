import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  getAllAdminStudents,
  isAuthorizedAdmin,
  updateStudentUserProfile,
} from "@/lib/serverDb";
import { AdminStudentSummary, ApiResponse, StudentUser } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/admin/students
 * Lists all registered students with their synced courses, goals, and bookings.
 */
export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const headerKey = req.headers.get("x-admin-key");
    if (!isAuthorizedAdmin(cookie, headerKey)) {
      return NextResponse.json<ApiResponse<null>>({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const students = await getAllAdminStudents();
    return NextResponse.json<ApiResponse<AdminStudentSummary[]>>({
      success: true,
      data: students,
      total: students.length,
    });
  } catch (err) {
    console.error("GET /api/admin/students error:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to load student roster" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/students
 * Allows Admin to update a student's academic profile fields (grade, curriculum, parentDream, aparId).
 */
export async function PATCH(req: NextRequest) {
  try {
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const headerKey = req.headers.get("x-admin-key");
    if (!isAuthorizedAdmin(cookie, headerKey)) {
      return NextResponse.json<ApiResponse<null>>({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, grade, curriculum, parentDream, aparId } = body;
    if (!userId || typeof userId !== "string") {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const updated = await updateStudentUserProfile(userId, {
      ...(grade !== undefined ? { grade } : {}),
      ...(curriculum !== undefined ? { curriculum } : {}),
      ...(parentDream !== undefined ? { parentDream } : {}),
      ...(aparId !== undefined ? { aparId } : {}),
    });

    if (!updated) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<StudentUser>>({ success: true, data: updated });
  } catch (err) {
    console.error("PATCH /api/admin/students error:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to update student profile" },
      { status: 500 }
    );
  }
}
