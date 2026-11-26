import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const googleConfigured = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );
  const smsConfigured = Boolean(
    process.env.FAST2SMS_API_KEY ||
      (process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_FROM_NUMBER)
  );
  const otpPreviewEnabled =
    !smsConfigured &&
    (process.env.NODE_ENV !== "production" || process.env.ALLOW_OTP_PREVIEW === "true");

  return NextResponse.json({
    googleConfigured,
    smsConfigured,
    otpPreviewEnabled,
  });
}
