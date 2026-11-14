import { NextRequest, NextResponse } from "next/server";
import {
  STUDENT_COOKIE_NAME,
  verifyStudentSessionToken,
  addStudentDiaryEntry,
} from "@/lib/serverDb";

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
    const { title, content, category } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Diary content cannot be empty" },
        { status: 400 }
      );
    }

    const newEntry = await addStudentDiaryEntry(userId, {
      title: (title && typeof title === "string" ? title.trim() : "Daily Reflection"),
      content: content.trim(),
      category: category || "reflection",
    });

    return NextResponse.json({
      success: true,
      entry: newEntry,
    });
  } catch (error: any) {
    console.error("Diary entry creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save diary entry" },
      { status: 500 }
    );
  }
}
