import AuthProvider from "@/components/SessionProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Google OAuth with NextAuth",
  description:
    "A simple authentication system using NextAuth.js and Google OAuth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {" "}
      {/* ✅ Wrap the app in the AuthProvider */}
      {children}
    </AuthProvider>
  );
}
