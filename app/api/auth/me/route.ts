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
    const userData = await getTokenData(req);

    if (!userData || !userData.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findById(userData.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
