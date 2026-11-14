import { NextRequest, NextResponse } from "next/server";
import {
  getStudentUserByEmail,
  getStudentUserById,
  hashStudentPassword,
  createStudentSessionToken,
  STUDENT_COOKIE_NAME,
} from "@/lib/serverDb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Quick Demo Login support
    if (body.demoUser) {
      let targetId = "usr_demo_aarav";
      if (body.demoUser === "meera") targetId = "usr_demo_meera";
      if (body.demoUser === "vihaan") targetId = "usr_demo_vihaan";

      const student = await getStudentUserById(targetId);
      if (!student) {
        return NextResponse.json(
          { success: false, error: "Demo student profile not found" },
          { status: 404 }
        );
      }

      const token = createStudentSessionToken(student.id);
      const res = NextResponse.json({
        success: true,
        user: student,
        message: `Logged in as demo student ${student.name}`,
      });

      res.cookies.set({
        name: STUDENT_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });

      return res;
    }

    // 2. Standard Email/Password login
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const found = await getStudentUserByEmail(email);
    if (!found) {
      return NextResponse.json(
        { success: false, error: "No student account found with this email" },
        { status: 401 }
      );
    }

    const enteredHash = hashStudentPassword(password);
    if (enteredHash !== found.passwordHash) {
      return NextResponse.json(
        { success: false, error: "Invalid password. (Demo password: student123)" },
        { status: 401 }
      );
    }

    const token = createStudentSessionToken(found.user.id);
    const res = NextResponse.json({
      success: true,
      user: found.user,
    });

    res.cookies.set({
      name: STUDENT_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return res;
  } catch (error: any) {
    console.error("Student login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during login" },
      { status: 500 }
    );
  }
}
