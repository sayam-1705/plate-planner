import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { signupSchema } from "@/lib/validation";

/**
 * POST handler for user registration
 * Processes user signup requests, validates input, and creates new users
 * @param req The incoming request with user data
 * @returns JSON response with signup status and user data
 */
export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Extract validated data
    const { name, email, password } = result.data;

    // Connect to database
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already in use" },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Return sanitized user object (without password)
    const sanitizedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: sanitizedUser,
      },
      { status: 201 }
    );
  } catch (error) {
    // Log and handle specific errors
    console.error("Signup error:", error);

    // Database connection error
    if ((error as Error).message.includes("MongoDB connection error")) {
      return NextResponse.json(
        { success: false, message: "Database connection failed" },
        { status: 503 }
      );
    }

    // Mongoose validation error
    if ((error as any).name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: (error as any).errors,
        },
        { status: 400 }
      );
    }

    // General server error
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
