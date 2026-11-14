import { NextRequest, NextResponse } from "next/server";
import {
  exportLeadsToCsv,
  isAuthorizedAdmin,
  ADMIN_COOKIE_NAME,
} from "@/lib/serverDb";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const headerKey = req.headers.get("x-admin-key");

    if (!isAuthorizedAdmin(cookie, headerKey)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const clientIp = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const csvContent = await exportLeadsToCsv(clientIp);

    const dateStr = new Date().toISOString().slice(0, 10);
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="ptiros_leads_${dateStr}.csv"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: unknown) {
    console.error("Error exporting leads to CSV:", err);
    return new NextResponse("Failed to export leads", { status: 500 });
  }
}
