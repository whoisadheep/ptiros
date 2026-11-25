import { NextRequest, NextResponse } from "next/server";
import {
  STUDENT_COOKIE_NAME,
  verifyStudentSessionToken,
  updateStudentUserProfile,
} from "@/lib/serverDb";
import {
  validateStudentName,
  validateEmailField,
  validateIndianMobileField,
  validateAgeField,
  validatePercentageField,
} from "@/lib/formValidation";

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
      const nameCheck = validateStudentName(body.name);
      if (!nameCheck.valid) {
        return NextResponse.json({ success: false, error: nameCheck.error }, { status: 400 });
      }
      updates.name = body.name.trim();
    }

    if (body.age !== undefined && body.age !== null && String(body.age).trim() !== "") {
      const ageCheck = validateAgeField(String(body.age));
      if (!ageCheck.valid) {
        return NextResponse.json({ success: false, error: ageCheck.error }, { status: 400 });
      }
      updates.age = Number(body.age);
    } else if (body.age === null || body.age === "") {
      updates.age = undefined;
    }

    if (typeof body.parentEmail === "string") {
      const emailCheck = validateEmailField(body.parentEmail, true, "Parent email");
      if (!emailCheck.valid) {
        return NextResponse.json({ success: false, error: emailCheck.error }, { status: 400 });
      }
      updates.parentEmail = body.parentEmail.trim().toLowerCase();
    }

    if (typeof body.parentPhone === "string") {
      const res = validateIndianMobileField(body.parentPhone, true, "Parent mobile");
      if (!res.valid) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      updates.parentPhone = res.digits;
    }

    if (typeof body.personalPhone === "string") {
      const res = validateIndianMobileField(body.personalPhone, false, "Personal mobile");
      if (!res.valid) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      updates.personalPhone = res.digits || undefined;
    }

    if (typeof body.lastYearPercentage === "string") {
      const pctCheck = validatePercentageField(body.lastYearPercentage);
      if (!pctCheck.valid) {
        return NextResponse.json({ success: false, error: pctCheck.error }, { status: 400 });
      }
      updates.lastYearPercentage = body.lastYearPercentage.trim();
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
