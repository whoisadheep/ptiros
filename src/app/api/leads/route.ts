import { NextRequest, NextResponse } from "next/server";
import {
  saveLead,
  updateLeadStatus,
  getDatabase,
  isAuthorizedAdmin,
  ADMIN_COOKIE_NAME,
  normalizeIndianMobile,
} from "@/lib/serverDb";
import { ApiResponse, StudentLead, LeadStatus } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/leads
 * Ingests a new student & parent lead from the intake modal or completion screen.
 */
export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(req.headers.get("content-length") || "0");
    if (contentLength > 16384) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Payload too large (Max 16KB)" },
        { status: 413 }
      );
    }

    const body = await req.json();

    // Honeypot bot protection: if filled, silently succeed without storing
    if (body.website || body.company_url || body.honeypot) {
      return NextResponse.json<ApiResponse<{ id: string }>>(
        { success: true, data: { id: "lead_ok" } },
        { status: 201 }
      );
    }

    if (!body.studentName || !body.parentPhone) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Student name and parent phone number are required" },
        { status: 400 }
      );
    }

    const phoneCheck = normalizeIndianMobile(body.parentPhone);
    if (!phoneCheck.isValid) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)" },
        { status: 400 }
      );
    }

    const newLead = await saveLead({
      studentName: String(body.studentName).slice(0, 100).trim(),
      grade: body.grade || "Class 10",
      schoolName: body.schoolName ? String(body.schoolName).slice(0, 120).trim() : undefined,
      city: String(body.city || "India").slice(0, 100).trim(),
      curriculum: body.curriculum || "CBSE",
      parentName: String(body.parentName || "Parent/Guardian").slice(0, 100).trim(),
      parentPhone: phoneCheck.normalized,
      parentDream: String(body.parentDream || "Open to child's discovered aptitude").slice(0, 500).trim(),
      source: body.source || "intake_modal",
      parentConsent: Boolean(body.parentConsent ?? true),
      notes: body.notes ? String(body.notes).slice(0, 500).trim() : undefined,
    });

    return NextResponse.json<ApiResponse<StudentLead>>(
      { success: true, data: newLead },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Error saving lead:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to persist lead record" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/leads
 * Retrieves leads for the Admin CRM (Protected).
 */
export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const headerKey = req.headers.get("x-admin-key");

    if (!isAuthorizedAdmin(cookie, headerKey)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized access to Admin CRM" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const grade = searchParams.get("grade");
    const status = searchParams.get("status");

    const store = await getDatabase();
    let leads = store.leads;

    if (search) {
      leads = leads.filter(
        (l) =>
          l.studentName.toLowerCase().includes(search) ||
          l.parentName.toLowerCase().includes(search) ||
          l.parentPhone.includes(search) ||
          (l.schoolName && l.schoolName.toLowerCase().includes(search)) ||
          l.city.toLowerCase().includes(search)
      );
    }

    if (grade && grade !== "all") {
      leads = leads.filter((l) => l.grade === grade);
    }

    if (status && status !== "all") {
      leads = leads.filter((l) => l.status === status);
    }

    return NextResponse.json<ApiResponse<StudentLead[]>>({
      success: true,
      data: leads,
      total: leads.length,
    });
  } catch (err: unknown) {
    console.error("Error fetching leads:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/leads
 * Updates a lead's status or notes (Admin only).
 */
export async function PATCH(req: NextRequest) {
  try {
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const headerKey = req.headers.get("x-admin-key");

    if (!isAuthorizedAdmin(cookie, headerKey)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Lead ID and new status are required" },
        { status: 400 }
      );
    }

    const updated = await updateLeadStatus(body.id, body.status as LeadStatus, body.notes);
    if (!updated) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<StudentLead>>({
      success: true,
      data: updated,
    });
  } catch (err: unknown) {
    console.error("Error updating lead status:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
