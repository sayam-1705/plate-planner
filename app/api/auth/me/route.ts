import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getTokenData } from "@/lib/auth";

/**
 * API endpoint to get the current user's data
 * Uses the auth token to identify and return user information
 * @param req The incoming request
 * @returns JSON response with user data
 */
export async function GET(req: NextRequest) {
  try {
    // Get user data from token
    const userData = await getTokenData(req);

    // Check for valid user data
    if (!userData || !userData.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      // Connect to database
      await dbConnect();

      // Find user by ID, excluding the password field
      const user = await User.findById(userData.id).select("-password");

      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (dbError) {
      console.error("Database error in /api/auth/me:", dbError);
      return NextResponse.json(
        { success: false, message: "Database error occurred" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
