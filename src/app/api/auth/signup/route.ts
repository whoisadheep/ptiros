import { NextRequest, NextResponse } from "next/server";
import {
  getStudentUserByEmail,
  createStudentUser,
  createStudentSessionToken,
  STUDENT_COOKIE_NAME,
} from "@/lib/serverDb";
import {
  validateStudentName,
  validateEmailField,
  validateIndianMobileField,
  validateAgeField,
  validatePercentageField,
  evaluatePassword,
} from "@/lib/formValidation";

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

    const nameCheck = validateStudentName(typeof name === "string" ? name : "");
    if (!nameCheck.valid) {
      return NextResponse.json({ success: false, error: nameCheck.error }, { status: 400 });
    }

    const emailCheck = validateEmailField(
      typeof email === "string" ? email : "",
      true,
      "Student email"
    );
    if (!emailCheck.valid) {
      return NextResponse.json({ success: false, error: emailCheck.error }, { status: 400 });
    }

    const parentEmailCheck = validateEmailField(
      typeof parentEmail === "string" ? parentEmail : "",
      true,
      "Parent email"
    );
    if (!parentEmailCheck.valid) {
      return NextResponse.json({ success: false, error: parentEmailCheck.error }, { status: 400 });
    }

    const parentPhoneCheck = validateIndianMobileField(
      typeof parentPhone === "string" ? parentPhone : "",
      true,
      "Parent mobile"
    );
    if (!parentPhoneCheck.valid) {
      return NextResponse.json({ success: false, error: parentPhoneCheck.error }, { status: 400 });
    }

    const personalPhoneCheck = validateIndianMobileField(
      typeof personalPhone === "string" ? personalPhone : "",
      false,
      "Student personal mobile"
    );
    if (!personalPhoneCheck.valid) {
      return NextResponse.json({ success: false, error: personalPhoneCheck.error }, { status: 400 });
    }

    const pwdEval = evaluatePassword(typeof password === "string" ? password : "");
    if (!pwdEval.allRequiredMet) {
      return NextResponse.json(
        {
          success: false,
          error: pwdEval.error || "Password must be at least 8 characters with uppercase, lowercase, and a number",
        },
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

    if (age !== undefined && age !== null && String(age).trim() !== "") {
      const ageCheck = validateAgeField(String(age));
      if (!ageCheck.valid) {
        return NextResponse.json({ success: false, error: ageCheck.error }, { status: 400 });
      }
    }

    if (typeof lastYearPercentage === "string" && lastYearPercentage.trim()) {
      const pctCheck = validatePercentageField(lastYearPercentage);
      if (!pctCheck.valid) {
        return NextResponse.json({ success: false, error: pctCheck.error }, { status: 400 });
      }
    }

    const parsedAge =
      age !== undefined && age !== null && String(age).trim() !== "" ? Number(age) : undefined;

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
      personalPhone: personalPhoneCheck.digits || undefined,
      parentEmail: parentEmail.trim().toLowerCase(),
      grade,
      schoolName: typeof schoolName === "string" ? schoolName.trim() : undefined,
      schoolAddress: typeof schoolAddress === "string" ? schoolAddress.trim() : undefined,
      city: typeof city === "string" && city.trim() ? city.trim() : "India",
      state: typeof state === "string" ? state.trim() : undefined,
      curriculum: typeof curriculum === "string" && curriculum.trim() ? curriculum.trim() : "CBSE",
      parentName: typeof parentName === "string" ? parentName.trim() : undefined,
      parentPhone: parentPhoneCheck.digits,
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
