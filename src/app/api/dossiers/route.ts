import { NextRequest, NextResponse } from "next/server";
import { saveDossierOrder, getDatabase, isAuthorizedAdmin, ADMIN_COOKIE_NAME } from "@/lib/serverDb";
import { ApiResponse, PaidDossierOrder } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.studentName || !body.parentPhone) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Student name and parent phone are required" },
        { status: 400 }
      );
    }

    const order = await saveDossierOrder({
      studentName: String(body.studentName).slice(0, 100).trim(),
      parentPhone: String(body.parentPhone).trim(),
      status: body.status || "payment_pending",
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
