import { NextRequest, NextResponse } from "next/server";
import {
  STUDENT_COOKIE_NAME,
  verifyStudentSessionToken,
  updateStudentUserProfile,
  normalizeIndianMobile,
} from "@/lib/serverDb";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get(STUDENT_COOKIE_NAME)?.value;
    const userId = verifyStudentSessionToken(token);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in as a student." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const updates: Record<string, any> = {};

    if (typeof body.name === "string") {
      if (body.name.trim().length < 2) {
        return NextResponse.json({ success: false, error: "Student name is too short" }, { status: 400 });
      }
      updates.name = body.name.trim();
    }

    if (body.age !== undefined && body.age !== null && String(body.age).trim() !== "") {
      const nAge = Number(body.age);
      if (!Number.isInteger(nAge) || nAge < 6 || nAge > 25) {
        return NextResponse.json({ success: false, error: "Age must be between 6 and 25" }, { status: 400 });
      }
      updates.age = nAge;
    } else if (body.age === null || body.age === "") {
      updates.age = undefined;
    }

    if (typeof body.parentEmail === "string") {
      const cleaned = body.parentEmail.trim().toLowerCase();
      if (cleaned && !EMAIL_RE.test(cleaned)) {
        return NextResponse.json({ success: false, error: "Please enter a valid parent email" }, { status: 400 });
      }
      updates.parentEmail = cleaned || undefined;
    }

    if (typeof body.parentPhone === "string") {
      const cleaned = body.parentPhone.trim();
      if (cleaned) {
        const res = normalizeIndianMobile(cleaned);
        if (!res.isValid) {
          return NextResponse.json(
            { success: false, error: "Parent mobile must be a valid 10-digit Indian mobile number" },
            { status: 400 }
          );
        }
        updates.parentPhone = res.normalized;
      } else {
        updates.parentPhone = undefined;
      }
    }

    if (typeof body.personalPhone === "string") {
      const cleaned = body.personalPhone.trim();
      if (cleaned) {
        const res = normalizeIndianMobile(cleaned);
        if (!res.isValid) {
          return NextResponse.json(
            { success: false, error: "Personal mobile must be a valid 10-digit number (or leave blank)" },
            { status: 400 }
          );
        }
        updates.personalPhone = res.normalized;
      } else {
        updates.personalPhone = undefined;
      }
    }

    const stringFields = [
      "gender",
      "address",
      "fatherName",
      "motherName",
      "grade",
      "schoolName",
      "schoolAddress",
      "city",
      "state",
      "curriculum",
      "parentName",
      "parentDream",
      "lastYearRank",
      "lastYearPercentage",
      "competitions",
      "aparId",
    ] as const;

    for (const key of stringFields) {
      if (typeof body[key] === "string") {
        updates[key] = body[key].trim();
      }
    }

    if (typeof body.singleChild === "boolean") updates.singleChild = body.singleChild;
    if (typeof body.proSports === "boolean") updates.proSports = body.proSports;

    const updatedUser = await updateStudentUserProfile(userId, updates);
    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "Student account not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Student profile update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save student details" },
      { status: 500 }
    );
  }
}
