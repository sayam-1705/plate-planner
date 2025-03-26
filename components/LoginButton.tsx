"use client"; // ✅ Ensure this is a Client Component

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import googleImage from "../images/google.png";

const LoginButton = () => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      {session ? (
        <>
          <p className="text-xl font-bold">Welcome, {session.user?.name}</p>
          <div className="rounded-full">
            <img
              src={session.user?.image ?? ""}
              alt="Profile Picture"
              className="w-16 h-16 rounded-full border border-gray-200"
            />
          </div>
          <button
            onClick={() => signOut()}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:opacity-90 focus:outline-none cursor-pointer"
          >
            Sign Out
          </button>
        </>
      ) : (
        <div
          onClick={() => signIn("google")}
          className="flex items-center gap-3 bg-white px-5 py-3 rounded-4xl cursor-pointer shadow-2xs border border-gray-200 hover:bg-gray-50"
        >
          <Image src={googleImage} alt="Google" width={20} height={20} />
          <span className="font-medium text-gray-800">Sign in with Google</span>
        </div>
      )}
    </div>
  );
};

export default LoginButton;
