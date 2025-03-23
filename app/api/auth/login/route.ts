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
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate input using Zod
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      // Return validation errors
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Extract validated data
    const { email, password } = result.data;

    try {
      // Connect to database
      await dbConnect();

      // Find user by email and explicitly select the password field
      const user = await User.findOne({ email }).select("+password");

      // Check if user exists
      if (!user) {
        return NextResponse.json(
          { success: false, message: "Invalid email or password" },
          { status: 401 }
        );
      }

      // Check if password exists in the user document
      if (!user.password) {
        console.error("User found but password field is missing");
        return NextResponse.json(
          { success: false, message: "Authentication error" },
          { status: 500 }
        );
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: "Invalid email or password" },
          { status: 401 }
        );
      }

      // Create JWT token
      const token = await createToken({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      });

      // Set auth cookie
      await setAuthCookie(token);

      // Return user data without password
      const userWithoutPassword = {
        id: user._id,
        name: user.name,
        email: user.email,
      };

      return NextResponse.json(
        { success: true, message: "Login successful", user: userWithoutPassword },
        { status: 200 }
      );
    } catch (dbError) {
      console.error("Database error during login:", dbError);
      return NextResponse.json(
        { success: false, message: "Database error occurred" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
