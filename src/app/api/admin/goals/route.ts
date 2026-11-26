import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  addStudentGoal,
  deleteStudentGoal,
  isAuthorizedAdmin,
} from "@/lib/serverDb";
import { ApiResponse, StudentPlannerGoal } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/admin/goals
 * Pushes a study milestone directly into a student's planner.
 */
export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const headerKey = req.headers.get("x-admin-key");
    if (!isAuthorizedAdmin(cookie, headerKey)) {
      return NextResponse.json<ApiResponse<null>>({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.userId || !body.title) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "userId and title are required" },
        { status: 400 }
      );
    }

    const timeView: "daily" | "monthly" | "yearly" =
      body.timeView === "monthly" || body.timeView === "yearly" ? body.timeView : "daily";

    const goal = await addStudentGoal(String(body.userId), {
      title: String(body.title).slice(0, 180),
      timeView,
      deadline: body.deadline ? String(body.deadline) : undefined,
    });

    if (!goal) {
      return NextResponse.json<ApiResponse<null>>({ success: false, error: "Failed to add goal" }, { status: 500 });
    }

    return NextResponse.json<ApiResponse<StudentPlannerGoal>>({ success: true, data: goal }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/goals error:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to push goal to student" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/goals?userId=...&goalId=...
 */
export async function DELETE(req: NextRequest) {
  try {
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const headerKey = req.headers.get("x-admin-key");
    if (!isAuthorizedAdmin(cookie, headerKey)) {
      return NextResponse.json<ApiResponse<null>>({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const goalId = searchParams.get("goalId");
    if (!userId || !goalId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "userId and goalId are required" },
        { status: 400 }
      );
    }

    await deleteStudentGoal(userId, goalId);
    return NextResponse.json<ApiResponse<{ deleted: boolean }>>({ success: true, data: { deleted: true } });
  } catch (err) {
    console.error("DELETE /api/admin/goals error:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to delete student goal" },
      { status: 500 }
    );
  }
}
