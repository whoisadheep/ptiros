import { NextRequest, NextResponse } from "next/server";
import {
  saveDossierOrder,
  getDatabase,
  isAuthorizedAdmin,
  ADMIN_COOKIE_NAME,
  STUDENT_COOKIE_NAME,
  verifyStudentSessionToken,
  normalizeIndianMobile,
} from "@/lib/serverDb";
import { ApiResponse, PaidDossierOrder } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const studentName = typeof body.studentName === "string" ? body.studentName.trim().slice(0, 100) : "";
    const rawPhone = typeof body.parentPhone === "string" ? body.parentPhone.trim() : "";
    const phoneCheck = normalizeIndianMobile(rawPhone);

    if (studentName.length < 2 || !phoneCheck.isValid) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Valid student name and 10-digit parent phone are required" },
        { status: 400 }
      );
    }

    const studentToken = req.cookies.get(STUDENT_COOKIE_NAME)?.value;
    const authenticatedUserId = verifyStudentSessionToken(studentToken);

    const order = await saveDossierOrder({
      userId: authenticatedUserId || undefined,
      careerTestId:
        authenticatedUserId && typeof body.careerTestId === "string"
          ? body.careerTestId.trim().slice(0, 64)
          : undefined,
      topTrackTitle:
        typeof body.topTrackTitle === "string"
          ? body.topTrackTitle.trim().slice(0, 140)
          : undefined,
      studentName,
      parentPhone: phoneCheck.normalized,
      status: "payment_pending",
    });

    return NextResponse.json<ApiResponse<PaidDossierOrder>>(
      { success: true, data: order },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Error creating dossier order:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to create dossier order" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const headerKey = req.headers.get("x-admin-key");

    if (!isAuthorizedAdmin(cookie, headerKey)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const store = await getDatabase();
    return NextResponse.json<ApiResponse<PaidDossierOrder[]>>({
      success: true,
      data: store.dossiers,
      total: store.dossiers.length,
    });
  } catch (err: unknown) {
    console.error("Error fetching dossier orders:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
