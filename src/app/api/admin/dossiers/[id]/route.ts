import { NextRequest, NextResponse } from "next/server";
import {
  updateDossierOrderStatus,
  isAuthorizedAdmin,
  ADMIN_COOKIE_NAME,
} from "@/lib/serverDb";
import { ApiResponse, PaidDossierOrder } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const headerKey = req.headers.get("x-admin-key");

    if (!isAuthorizedAdmin(cookie, headerKey)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await req.json();
    const status = body.status as PaidDossierOrder["status"];

    if (!id || !["payment_pending", "paid", "pdf_dispatched"].includes(status)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Valid dossier order ID and status are required" },
        { status: 400 }
      );
    }

    const updated = await updateDossierOrderStatus(id, status);
    if (!updated) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Dossier order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<PaidDossierOrder>>({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error("Error updating dossier order:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to update dossier order" },
      { status: 500 }
    );
  }
}
