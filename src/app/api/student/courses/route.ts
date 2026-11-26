import { NextRequest, NextResponse } from "next/server";
import {
  STUDENT_COOKIE_NAME,
  updateAssignedCourseStatus,
  verifyStudentSessionToken,
} from "@/lib/serverDb";
import { ApiResponse, StudentAssignedCourse } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * PATCH /api/student/courses
 * Allows an authenticated student to update progress status on an assigned course.
 */
export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get(STUDENT_COOKIE_NAME)?.value;
    const userId = verifyStudentSessionToken(token);
    if (!userId) {
      return NextResponse.json<ApiResponse<null>>({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { courseId, status } = body;
    if (!courseId || !["assigned", "in_progress", "completed"].includes(status)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Valid courseId and status are required" },
        { status: 400 }
      );
    }

    const updated = await updateAssignedCourseStatus(String(courseId), status, userId);
    if (!updated) {
      return NextResponse.json<ApiResponse<null>>({ success: false, error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json<ApiResponse<StudentAssignedCourse>>({ success: true, data: updated });
  } catch (err) {
    console.error("PATCH /api/student/courses error:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to update course status" },
      { status: 500 }
    );
  }
}
