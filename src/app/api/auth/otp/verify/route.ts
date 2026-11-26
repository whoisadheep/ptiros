import { NextRequest, NextResponse } from "next/server";
import {
  normalizeIndianMobile,
  verifyPhoneOtpRecord,
  getStudentUserByPhone,
  createPhoneStudentUser,
  createPhoneVerificationToken,
  verifyPhoneVerificationToken,
  createStudentSessionToken,
  STUDENT_COOKIE_NAME,
} from "@/lib/serverDb";
import { validateStudentName, validateEmailField } from "@/lib/formValidation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Branch A: Completing registration using a short-lived verified phone token
    if (typeof body?.verifiedPhoneToken === "string" && body.verifiedPhoneToken) {
      const verifiedPhone = verifyPhoneVerificationToken(body.verifiedPhoneToken);
      if (!verifiedPhone) {
        return NextResponse.json(
          { success: false, error: "Phone verification expired. Please request a new OTP." },
          { status: 401 }
        );
      }

      const nameCheck = validateStudentName(typeof body.name === "string" ? body.name : "");
      if (!nameCheck.valid) {
        return NextResponse.json({ success: false, error: nameCheck.error }, { status: 400 });
      }

      const parentEmailCheck = validateEmailField(
        typeof body.parentEmail === "string" ? body.parentEmail : "",
        false,
        "Parent email"
      );
      if (!parentEmailCheck.valid) {
        return NextResponse.json({ success: false, error: parentEmailCheck.error }, { status: 400 });
      }

      const grade =
        typeof body.grade === "string" && body.grade.trim() ? body.grade.trim() : "Class 10";

      const existing = await getStudentUserByPhone(verifiedPhone);
      const user =
        existing ||
        (await createPhoneStudentUser({
          phone: verifiedPhone,
          name: body.name.trim(),
          grade,
          parentEmail: typeof body.parentEmail === "string" ? body.parentEmail.trim() : undefined,
          curriculum: typeof body.curriculum === "string" ? body.curriculum.trim() : "CBSE",
          city: typeof body.city === "string" ? body.city.trim() : "India",
        }));

      const token = createStudentSessionToken(user.id);
      const res = NextResponse.json({
        success: true,
        mode: existing ? "login" : "signup",
        user,
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
    }

    // Branch B: Verifying 6-digit OTP
    const phoneCheck = normalizeIndianMobile(typeof body?.phone === "string" ? body.phone : "");
    if (!phoneCheck.isValid) {
      return NextResponse.json(
        { success: false, error: "Enter a valid 10-digit Indian mobile number" },
        { status: 400 }
      );
    }

    const code = typeof body?.otp === "string" ? body.otp : "";
    const verifyRes = await verifyPhoneOtpRecord(phoneCheck.normalized, code);
    if (!verifyRes.ok) {
      return NextResponse.json(
        { success: false, error: verifyRes.error || "Invalid verification code" },
        { status: 401 }
      );
    }

    const existingUser = await getStudentUserByPhone(phoneCheck.normalized);
    if (existingUser) {
      const token = createStudentSessionToken(existingUser.id);
      const res = NextResponse.json({
        success: true,
        mode: "login",
        user: existingUser,
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
    }

    // New phone number: return short-lived signed token so student enters Name + Class
    const verifiedPhoneToken = createPhoneVerificationToken(phoneCheck.normalized);
    return NextResponse.json({
      success: true,
      requiresProfile: true,
      phone: phoneCheck.normalized,
      verifiedPhoneToken,
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
