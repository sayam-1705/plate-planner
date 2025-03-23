import { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { JWTPayload } from "jose";

/**
 * Secret key for JWT signing and verification
 * Should be set as an environment variable
 */
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Warning for missing environment variable
if (!process.env.JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET not set in environment variables. Using default secret is not secure for production.");
}

/**
 * Extended JWT payload interface to include user information
 */
export interface UserJwtPayload extends JWTPayload {
  id: string;
  email: string;
  name: string;
}

/**
 * Creates a JWT token containing user data
 * @param payload User data to encode in the token
 * @returns JWT token string
 */
export async function createToken(payload: UserJwtPayload): Promise<string> {
  try {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(new TextEncoder().encode(JWT_SECRET));
  } catch (error) {
    console.error("Error creating JWT token:", error);
    throw new Error("Failed to create authentication token");
  }
}

/**
 * Verifies and decodes a JWT token
 * @param token JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export async function verifyToken(token: string): Promise<UserJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    return payload as UserJwtPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Extracts and verifies user data from request cookies
 * @param req Next.js request object
 * @returns User data from token or null if not authenticated
 */
export async function getTokenData(req: NextRequest): Promise<UserJwtPayload | null> {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return null;

    return await verifyToken(token);
  } catch (error) {
    console.error("Error getting token data:", error);
    return null;
  }
}

/**
 * Sets the authentication cookie with the JWT token
 * @param token JWT token to store in cookie
 */
export async function setAuthCookie(token: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "strict",
    });
  } catch (error) {
    console.error("Error setting auth cookie:", error);
    throw new Error("Failed to set authentication cookie");
  }
}
