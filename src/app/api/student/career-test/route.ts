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
  CAREER_ASSESSMENT_QUESTIONS,
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
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, error: "Invalid submission payload" },
        { status: 400 }
      );
    }

    if (
      !body.answers ||
      typeof body.answers !== "object" ||
      Array.isArray(body.answers)
    ) {
      return NextResponse.json(
        { success: false, error: "Assessment answers must be an object" },
        { status: 400 }
      );
    }

    const rawAnswers = body.answers as Record<string, unknown>;
    const answerKeys = Object.keys(rawAnswers);
    if (answerKeys.length === 0 || answerKeys.length > 20) {
      return NextResponse.json(
        { success: false, error: "Invalid number of assessment answers" },
        { status: 400 }
      );
    }

    // Validate every answered question maps to a real question and option ID
    const answers: Record<string, string> = {};
    for (const q of CAREER_ASSESSMENT_QUESTIONS) {
      const val = rawAnswers[q.id];
      if (typeof val !== "string") {
        return NextResponse.json(
          { success: false, error: `Missing or invalid answer for ${q.id}` },
          { status: 400 }
        );
      }
      const validOpt = q.options.find((o) => o.id === val || o.text === val);
      if (!validOpt) {
        return NextResponse.json(
          { success: false, error: `Invalid option selected for ${q.id}` },
          { status: 400 }
        );
      }
      answers[q.id] = validOpt.id;
    }

    const token = req.cookies.get(STUDENT_COOKIE_NAME)?.value;
    const userId = verifyStudentSessionToken(token);
    const user = userId ? await getStudentUserById(userId) : null;

    const studentName = String(body.studentName || user?.name || "PTIROS Student")
      .trim()
      .slice(0, 120);
    const grade = String(body.grade || user?.grade || "Class 10")
      .trim()
      .slice(0, 40);

    const context: AssessmentStudentContext = {
      studentName,
      grade,
      curriculum: (typeof body.curriculum === "string" ? body.curriculum : user?.curriculum)?.slice(0, 40),
      city: (typeof body.city === "string" ? body.city : user?.city)?.slice(0, 100),
      state: (typeof body.state === "string" ? body.state : user?.state)?.slice(0, 80),
      schoolName: (typeof body.schoolName === "string" ? body.schoolName : user?.schoolName)?.slice(0, 150),
      parentName: (typeof body.parentName === "string" ? body.parentName : user?.parentName || user?.fatherName || user?.motherName)?.slice(0, 120),
      parentDream: (typeof body.parentDream === "string" ? body.parentDream : user?.parentDream || (typeof body.childhoodDream === "string" ? body.childhoodDream : undefined))?.slice(0, 200),
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
