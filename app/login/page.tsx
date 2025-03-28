import LoginForm from "@/components/LoginForm";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTokenData } from "@/lib/auth";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Login | Plane Planner",
  description: "Log in to your Plane Planner account",
};

interface LoginPageProps {
  searchParams?: Promise<{ callbackUrl?: string }> | { callbackUrl?: string };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
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

  // Get the callback URL from search params
  const resolvedSearchParams = searchParams instanceof Promise ? await searchParams : searchParams;
  const callbackUrl = resolvedSearchParams?.callbackUrl || "";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <LoginForm callbackUrl={callbackUrl} />
    </div>
  );
}
