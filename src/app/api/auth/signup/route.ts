import { NextRequest, NextResponse } from "next/server";
import {
  getStudentUserByEmail,
  createStudentUser,
  createStudentSessionToken,
  normalizeIndianMobile,
  STUDENT_COOKIE_NAME,
} from "@/lib/serverDb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      grade,
      schoolName,
      city,
      curriculum,
      parentName,
      parentPhone,
      parentDream,
    } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid student full name" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    if (!grade || typeof grade !== "string") {
      return NextResponse.json(
        { success: false, error: "Please select your current grade/class" },
        { status: 400 }
      );
    }

    // Check if email already registered
    const existing = await getStudentUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists. Please log in." },
        { status: 409 }
      );
    }

    // Phone normalization if provided
    let normPhone = "";
    if (parentPhone) {
      const { isValid, normalized } = normalizeIndianMobile(parentPhone);
      if (isValid) {
        normPhone = normalized;
      }
    }

    const newUser = await createStudentUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      grade,
      schoolName: schoolName?.trim(),
      city: city?.trim() || "India",
      curriculum: curriculum || "CBSE",
      parentName: parentName?.trim(),
      parentPhone: normPhone || undefined,
      parentDream: parentDream?.trim(),
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
