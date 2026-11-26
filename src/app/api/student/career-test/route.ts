import { NextRequest, NextResponse } from "next/server";
import {
  STUDENT_COOKIE_NAME,
  verifyStudentSessionToken,
  getStudentUserById,
  saveStudentCareerTest,
  getStudentCareerTests,
  saveLead,
} from "@/lib/serverDb";
import {
  evaluateCareerAssessment,
  type AssessmentStudentContext,
} from "@/lib/careerAssessment";
import type { StudentGrade, SchoolCurriculum } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(STUDENT_COOKIE_NAME)?.value;
    const userId = verifyStudentSessionToken(token);
    if (!userId) {
      return NextResponse.json(
        { success: false, authenticated: false, error: "Sign in to view saved career tests" },
        { status: 401 }
      );
    }

    const careerTests = await getStudentCareerTests(userId);
    return NextResponse.json({
      success: true,
      authenticated: true,
      careerTests,
    });
  } catch (err) {
    console.error("Career test fetch error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load saved career test reports" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const answers =
      body.answers && typeof body.answers === "object"
        ? (body.answers as Record<string, string>)
        : {};

    if (Object.keys(answers).length === 0) {
      return NextResponse.json(
        { success: false, error: "Assessment answers are required" },
        { status: 400 }
      );
    }

    const token = req.cookies.get(STUDENT_COOKIE_NAME)?.value;
    const userId = verifyStudentSessionToken(token);
    const user = userId ? await getStudentUserById(userId) : null;

    const studentName = String(body.studentName || user?.name || "PTIROS Student").trim();
    const grade = String(body.grade || user?.grade || "Class 10").trim();

    const context: AssessmentStudentContext = {
      studentName,
      grade,
      curriculum: body.curriculum || user?.curriculum,
      city: body.city || user?.city,
      state: body.state || user?.state,
      schoolName: body.schoolName || user?.schoolName,
      parentName: body.parentName || user?.parentName || user?.fatherName || user?.motherName,
      parentDream: body.parentDream || user?.parentDream || body.childhoodDream,
      lastYearPercentage: user?.lastYearPercentage,
      lastYearRank: user?.lastYearRank,
      proSports: user?.proSports,
      competitions: user?.competitions,
      aparId: user?.aparId,
    };

    const evaluated = evaluateCareerAssessment(answers, context);

    // Always record/update CRM lead if phone is supplied or user profile exists
    const parentPhone = String(body.parentPhone || user?.parentPhone || "").trim();
    if (parentPhone && studentName) {
      await saveLead({
        studentName,
        grade: grade as StudentGrade,
        schoolName: context.schoolName,
        city: context.city || "India",
        curriculum: (context.curriculum || "CBSE") as SchoolCurriculum,
        parentName: context.parentName || "Parent",
        parentPhone,
        parentDream: context.parentDream || evaluated.topTrack.title,
        source: "career_test",
        parentConsent: true,
        notes: `Career Diagnostic Completed. Top Track: ${evaluated.topTrack.title} (${evaluated.matchConfidence}%), Archetype: ${evaluated.archetype}, Recommended Stream: ${evaluated.recommendedStream}`,
      }).catch(() => {});
    }

    if (!user) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        savedToPortal: false,
        record: {
          id: `guest_${Date.now()}`,
          userId: "guest",
          studentName,
          grade,
          topTrackId: evaluated.topTrack.id,
          topTrackTitle: evaluated.topTrack.title,
          matchConfidence: evaluated.matchConfidence,
          archetype: evaluated.archetype,
          recommendedStream: evaluated.recommendedStream,
          answers,
          dimensionScores: evaluated.dimensionScores,
          rankedTracks: evaluated.rankedTracks,
          dossierUnlocked: false,
          completedAt: new Date().toISOString(),
        },
      });
    }

    const saved = await saveStudentCareerTest(user.id, {
      studentName,
      grade,
      topTrackId: evaluated.topTrack.id,
      topTrackTitle: evaluated.topTrack.title,
      matchConfidence: evaluated.matchConfidence,
      archetype: evaluated.archetype,
      recommendedStream: evaluated.recommendedStream,
      answers,
      dimensionScores: evaluated.dimensionScores,
      rankedTracks: evaluated.rankedTracks,
    });

    return NextResponse.json(
      {
        success: true,
        authenticated: true,
        savedToPortal: true,
        record: saved,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Career test evaluation/save error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to evaluate career assessment" },
      { status: 500 }
    );
  }
}
