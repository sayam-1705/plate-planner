import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Handles user logout by clearing authentication cookies
 * @returns JSON response indicating logout status
 */
export async function POST() {
  try {
    // Clear auth cookie
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");

    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to logout" },
      { status: 500 }
    );
  }
}
