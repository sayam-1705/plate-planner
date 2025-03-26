"use client"; // ✅ Make this a Client Component

import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
