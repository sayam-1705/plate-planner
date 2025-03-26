"use server";

import { SignupInput, loginSchema, signupSchema } from "@/lib/validation";
import { LoginInput } from "./validation";
import { redirect } from "next/navigation";
import { createToken, setAuthCookie } from "./auth";

export async function loginAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate input
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      return {
        success: false,
        message:
          Object.values(result.error.flatten().fieldErrors)[0]?.[0] ||
          "Invalid input",
      };
    }

    // Call login API
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Login failed" };
    }

    // For server components, we need to set the cookie here as well
    const token = await createToken({
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
    });

    await setAuthCookie(token);

    // On success, redirect to dashboard or requested callback URL
    const url = new URL(
      (formData.get("callbackUrl") as string) || "/dashboard",
      process.env.NEXTAUTH_URL
    );
    redirect(url.pathname + url.search);
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}

export async function signupAction(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate input
    const result = signupSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });
    if (!result.success) {
      return {
        success: false,
        message:
          Object.values(result.error.flatten().fieldErrors)[0]?.[0] ||
          "Invalid input",
      };
    }

    // Call signup API
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/auth/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Signup failed" };
    }

    return {
      success: true,
      message: "Account created successfully! Please log in.",
    };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}
