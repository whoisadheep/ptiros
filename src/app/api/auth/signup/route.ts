import { NextRequest, NextResponse } from "next/server";
import {
  getStudentUserByEmail,
  createStudentUser,
  createStudentSessionToken,
  normalizeIndianMobile,
  STUDENT_COOKIE_NAME,
} from "@/lib/serverDb";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      age,
      gender,
      address,
      singleChild,
      fatherName,
      motherName,
      personalPhone,
      parentEmail,
      grade,
      schoolName,
      schoolAddress,
      city,
      state,
      curriculum,
      parentName,
      parentPhone,
      parentDream,
      lastYearRank,
      lastYearPercentage,
      proSports,
      competitions,
      aparId,
    } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid student full name" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid student email address" },
        { status: 400 }
      );
    }

    if (!parentEmail || typeof parentEmail !== "string" || !EMAIL_RE.test(parentEmail.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid parent email address" },
        { status: 400 }
      );
    }

    const parentPhoneCheck = normalizeIndianMobile(typeof parentPhone === "string" ? parentPhone : "");
    if (!parentPhoneCheck.isValid) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid 10-digit parent mobile number" },
        { status: 400 }
      );
    }

    let normPersonalPhone: string | undefined;
    if (typeof personalPhone === "string" && personalPhone.trim()) {
      const personalCheck = normalizeIndianMobile(personalPhone);
      if (!personalCheck.isValid) {
        return NextResponse.json(
          { success: false, error: "Personal mobile must be a valid 10-digit number (or leave blank)" },
          { status: 400 }
        );
      }
      normPersonalPhone = personalCheck.normalized;
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    if (!grade || typeof grade !== "string") {
      return NextResponse.json(
        { success: false, error: "Please select your current class" },
        { status: 400 }
      );
    }

    const existing = await getStudentUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    const parsedAge =
      age !== undefined && age !== null && String(age).trim() !== "" ? Number(age) : undefined;
    if (parsedAge !== undefined && (!Number.isInteger(parsedAge) || parsedAge < 6 || parsedAge > 25)) {
      return NextResponse.json(
        { success: false, error: "Age must be a whole number between 6 and 25" },
        { status: 400 }
      );
    }

    const newUser = await createStudentUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      age: parsedAge,
      gender: typeof gender === "string" ? gender.trim() : undefined,
      address: typeof address === "string" ? address.trim() : undefined,
      singleChild: typeof singleChild === "boolean" ? singleChild : undefined,
      fatherName: typeof fatherName === "string" ? fatherName.trim() : undefined,
      motherName: typeof motherName === "string" ? motherName.trim() : undefined,
      personalPhone: normPersonalPhone,
      parentEmail: parentEmail.trim().toLowerCase(),
      grade,
      schoolName: typeof schoolName === "string" ? schoolName.trim() : undefined,
      schoolAddress: typeof schoolAddress === "string" ? schoolAddress.trim() : undefined,
      city: typeof city === "string" && city.trim() ? city.trim() : "India",
      state: typeof state === "string" ? state.trim() : undefined,
      curriculum: typeof curriculum === "string" && curriculum.trim() ? curriculum.trim() : "CBSE",
      parentName: typeof parentName === "string" ? parentName.trim() : undefined,
      parentPhone: parentPhoneCheck.normalized,
      parentDream: typeof parentDream === "string" ? parentDream.trim() : undefined,
      lastYearRank: typeof lastYearRank === "string" ? lastYearRank.trim() : undefined,
      lastYearPercentage: typeof lastYearPercentage === "string" ? lastYearPercentage.trim() : undefined,
      proSports: typeof proSports === "boolean" ? proSports : undefined,
      competitions: typeof competitions === "string" ? competitions.trim() : undefined,
      aparId: typeof aparId === "string" ? aparId.trim() : undefined,
    });

    const token = createStudentSessionToken(newUser.id);
    const res = NextResponse.json({
      success: true,
      user: newUser,
      message: "Student account created successfully",
    });

    res.cookies.set({
      name: STUDENT_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return res;
  } catch (error: any) {
    console.error("Student signup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create student account" },
      { status: 500 }
    );
  }
}
