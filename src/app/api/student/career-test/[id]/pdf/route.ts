import { NextRequest, NextResponse } from "next/server";
import {
  STUDENT_COOKIE_NAME,
  verifyStudentSessionToken,
  getStudentUserById,
  getStudentCareerTestById,
} from "@/lib/serverDb";
import { generateCareerReportPdfBytes, sanitizePdfText } from "@/lib/pdfGenerator";
import type { AssessmentStudentContext } from "@/lib/careerAssessment";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  contextRoute: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get(STUDENT_COOKIE_NAME)?.value;
    const userId = verifyStudentSessionToken(token);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Sign in to download saved PDF reports" },
        { status: 401 }
      );
    }

    const { id } = await contextRoute.params;
    const tierParam = req.nextUrl.searchParams.get("tier");
    const tier: "free" | "full" = tierParam === "full" ? "full" : "free";

    const [user, record] = await Promise.all([
      getStudentUserById(userId),
      getStudentCareerTestById(userId, id),
    ]);

    if (!user || !record) {
      return NextResponse.json(
        { success: false, error: "Career test report not found" },
        { status: 404 }
      );
    }

    if (tier === "full" && !record.dossierUnlocked) {
      return NextResponse.json(
        {
          success: false,
          error: "Full 9-page dossier requires unlock confirmation (Rs. 499 pass).",
        },
        { status: 403 }
      );
    }

    const context: AssessmentStudentContext = {
      studentName: record.studentName || user.name,
      grade: record.grade || user.grade,
      curriculum: user.curriculum,
      city: user.city,
      state: user.state,
      schoolName: user.schoolName,
      parentName: user.parentName || user.fatherName || user.motherName,
      parentDream: user.parentDream,
      lastYearPercentage: user.lastYearPercentage,
      lastYearRank: user.lastYearRank,
      proSports: user.proSports,
      competitions: user.competitions,
      aparId: user.aparId,
    };

    const pdfBytes = await generateCareerReportPdfBytes(record, context, tier);
    const safeSlug = sanitizePdfText(record.studentName)
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "Student";

    const filename =
      tier === "full"
        ? `PTIROS-Complete-9Page-Dossier-${safeSlug}.pdf`
        : `PTIROS-Free-Basic-Analysis-${safeSlug}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("Career test PDF generation error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to generate PDF report" },
      { status: 500 }
    );
  }
}
