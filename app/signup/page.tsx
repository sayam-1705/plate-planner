import SignupForm from "@/components/SignupForm";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTokenData } from "@/lib/auth";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Sign Up | Plane Planner",
  description: "Create a new Plane Planner account",
};

export default async function SignupPage() {
  // Server-side authentication check
  const token = (await cookies()).get("auth-token")?.value;
  if (token) {
    const userData = token
      ? await getTokenData({
          cookies: () => ({ get: (name: string) => ({ value: token }) }),
        } as any)
      : null;
    if (userData) {
      redirect("/dashboard");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignupForm />
    </div>
  );
}
