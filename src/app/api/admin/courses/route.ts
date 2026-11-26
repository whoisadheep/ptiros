import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  assignCourseToStudent,
  deleteAssignedCourse,
  isAuthorizedAdmin,
} from "@/lib/serverDb";
import { ApiResponse, StudentAssignedCourse } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/admin/courses
 * Assigns a course / experiential track to a student's portal.
 */
export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const headerKey = req.headers.get("x-admin-key");
    if (!isAuthorizedAdmin(cookie, headerKey)) {
      return NextResponse.json<ApiResponse<null>>({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.userId || !body.title || !body.courseCode) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "userId, courseCode, and title are required" },
        { status: 400 }
      );
    }

    const created = await assignCourseToStudent({
      userId: String(body.userId),
      courseCode: String(body.courseCode),
      title: String(body.title).slice(0, 140),
      category: String(body.category || "Experiential Track"),
      description: body.description ? String(body.description).slice(0, 400) : undefined,
      simulatorUrl: body.simulatorUrl ? String(body.simulatorUrl) : undefined,
      assignedBy: body.assignedBy ? String(body.assignedBy) : "PTIROS Mentor Council",
      mentorNote: body.mentorNote ? String(body.mentorNote).slice(0, 500) : undefined,
      dueDate: body.dueDate ? String(body.dueDate) : undefined,
    });

    if (!created) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Could not assign course" },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<StudentAssignedCourse>>({ success: true, data: created }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/courses error:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to assign course" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/courses?id=...
 */
export async function DELETE(req: NextRequest) {
  try {
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const headerKey = req.headers.get("x-admin-key");
    if (!isAuthorizedAdmin(cookie, headerKey)) {
      return NextResponse.json<ApiResponse<null>>({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json<ApiResponse<null>>({ success: false, error: "Course id is required" }, { status: 400 });
    }

    await deleteAssignedCourse(id);
    return NextResponse.json<ApiResponse<{ deleted: boolean }>>({ success: true, data: { deleted: true } });
  } catch (err) {
    console.error("DELETE /api/admin/courses error:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to remove assigned course" },
      { status: 500 }
    );
  }
}
