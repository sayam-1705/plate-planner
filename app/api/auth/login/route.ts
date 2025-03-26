import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { loginSchema } from "@/lib/validation";
import { createToken, setAuthCookie } from "@/lib/auth";

/**
 * API endpoint for user login
 * Validates credentials and provides authentication token
 * @param req The incoming request with login credentials
 * @returns JSON response with login status and user data
 */
export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: Object.values(result.error.flatten().fieldErrors)[0]?.[0] || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    await dbConnect();

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await createToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    await setAuthCookie(token);

    const userWithoutPassword = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    return NextResponse.json(
      { success: true, message: "Login successful", user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 500 }
    );
  }
}
