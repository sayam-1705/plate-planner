"use client";

import React from "react";
import { useActionState } from "react";
import InputBox from "./InputBox";
import SubmitButton from "./SubmitButton";
import FormError from "./FormError";
import { loginAction } from "@/lib/actions";
import Link from "next/link";
import LoginButton from "./LoginButton";

interface LoginFormProps {
  callbackUrl?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ callbackUrl = "" }) => {
  const initialState = { message: "", success: false };
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
        Login to Your Account
      </h2>

      <form action={formAction}>
        {callbackUrl && (
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
        )}

        <div className="space-y-4">
          <InputBox
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
          />

          <InputBox
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        {state?.message && <FormError message={state.message} />}

        <SubmitButton text="Log In" loadingText="Logging in..." />
      </form>

      <div className="mt-4">
        <LoginButton />
      </div>

      <p className="mt-4 text-center text-gray-600">
        Don't have an account?{" "}
        <Link href="/signup" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
