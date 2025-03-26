"use client";

import React from "react";
import { useActionState } from "react";
import InputBox from "./InputBox";
import SubmitButton from "./SubmitButton";
import FormError from "./FormError";
import FormSuccess from "./FormSuccess";
import { signupAction } from "@/lib/actions";
import Link from "next/link";

const SignupForm: React.FC = () => {
  const initialState = { message: "", success: false };
  const [state, formAction] = useActionState(signupAction, initialState);

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
        Create an Account
      </h2>

      <form action={formAction}>
        <div className="space-y-4">
          <InputBox
            label="Full Name"
            name="name"
            placeholder="Enter your name"
            required
          />

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
            placeholder="Create a password"
            required
          />

          <InputBox
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
          />
        </div>

        {state?.success ? (
          <FormSuccess message={state.message} />
        ) : (
          state?.message && <FormError message={state.message} />
        )}

        <SubmitButton text="Sign Up" loadingText="Creating account..." />
      </form>

      <p className="mt-4 text-center text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
