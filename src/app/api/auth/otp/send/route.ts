import { NextRequest, NextResponse } from "next/server";
import {
  normalizeIndianMobile,
  createPhoneOtpRecord,
  getStudentUserByPhone,
} from "@/lib/serverDb";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function dispatchSmsOtp(phone10: string, otp: string): Promise<"fast2sms" | "twilio" | "preview" | "unconfigured"> {
  if (process.env.FAST2SMS_API_KEY) {
    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "otp",
        variables_values: otp,
        numbers: phone10,
      }),
    });
    if (res.ok) return "fast2sms";
  }

  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM_NUMBER
  ) {
    const auth = Buffer.from(
      `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
    ).toString("base64");
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: process.env.TWILIO_FROM_NUMBER,
          To: `+91${phone10}`,
          Body: `Your PTIROS Student Portal verification code is ${otp}. Valid for 10 minutes.`,
        }),
      }
    );
    if (res.ok) return "twilio";
  }

  if (process.env.NODE_ENV !== "production" || process.env.ALLOW_OTP_PREVIEW === "true") {
    return "preview";
  }

  return "unconfigured";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPhone = typeof body?.phone === "string" ? body.phone : "";
    const phoneCheck = normalizeIndianMobile(rawPhone);

    if (!phoneCheck.isValid) {
      return NextResponse.json(
        { success: false, error: "Enter a valid 10-digit Indian mobile number" },
        { status: 400 }
      );
    }

    const { otp, expiresAt } = await createPhoneOtpRecord(phoneCheck.normalized);
    const deliveryMode = await dispatchSmsOtp(phoneCheck.normalized, otp);

    if (deliveryMode === "unconfigured") {
      return NextResponse.json(
        {
          success: false,
          error: "SMS provider is not configured on this server yet. Please use Email login.",
        },
        { status: 503 }
      );
    }

    const existingUser = await getStudentUserByPhone(phoneCheck.normalized);

    return NextResponse.json({
      success: true,
      phone: phoneCheck.normalized,
      accountExists: Boolean(existingUser),
      deliveryMode,
      expiresAt,
      ...(deliveryMode === "preview" ? { devOtpPreview: otp } : {}),
    });
  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to generate verification code" },
      { status: 500 }
    );
  }
}
