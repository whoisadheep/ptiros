import { NextRequest, NextResponse } from "next/server";
import {
  STUDENT_COOKIE_NAME,
  verifyStudentSessionToken,
  toggleStudentGoal,
  addStudentGoal,
} from "@/lib/serverDb";

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get(STUDENT_COOKIE_NAME)?.value;
    const userId = verifyStudentSessionToken(token);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in as a student." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { goalId, completed } = body;

    if (!goalId || typeof completed !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Goal ID and completed status are required" },
        { status: 400 }
      );
    }

    await toggleStudentGoal(userId, goalId, completed);
    return NextResponse.json({ success: true, goalId, completed });
  } catch (error: any) {
    console.error("Planner goal patch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update goal" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(STUDENT_COOKIE_NAME)?.value;
    const userId = verifyStudentSessionToken(token);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in as a student." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, timeView, deadline } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Goal title is required" },
        { status: 400 }
      );
    }

    const validView = timeView === "monthly" || timeView === "yearly" ? timeView : "daily";

    const newGoal = await addStudentGoal(userId, {
      title: title.trim(),
      timeView: validView,
      deadline: deadline?.trim(),
    });

    return NextResponse.json({ success: true, goal: newGoal });
  } catch (error: any) {
    console.error("Planner goal post error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create goal" },
      { status: 500 }
    );
  }
}
