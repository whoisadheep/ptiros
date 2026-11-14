import { NextRequest, NextResponse } from "next/server";
import {
  getAdminMetrics,
  isAuthorizedAdmin,
  ADMIN_COOKIE_NAME,
} from "@/lib/serverDb";
import { ApiResponse, AdminMetricsSummary } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

    const metrics = await getAdminMetrics();
    return NextResponse.json<ApiResponse<AdminMetricsSummary>>({
      success: true,
      data: metrics,
    });
  } catch (err: unknown) {
    console.error("Error fetching admin metrics:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to compile admin metrics" },
      { status: 500 }
    );
  }
}
