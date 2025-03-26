"use client"; // ✅ Ensure this is a Client Component

import { signIn, signOut, useSession } from "next-auth/react";

const LoginButton = () => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      {session ? (
        <>
          <p className="text-lg font-semibold">Welcome, {session.user?.name}</p>
          <img
            src={session.user?.image ?? ""}
            alt="Profile Picture"
            className="w-16 h-16 rounded-full"
          />
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default LoginButton;
