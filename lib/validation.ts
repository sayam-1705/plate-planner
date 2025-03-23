import { z } from "zod";

/**
 * Email validation schema with comprehensive format checking
 * Ensures email follows standard format and doesn't contain spaces
 */
const emailSchema = z
  .string()
  .min(1, { message: "Email is required" })
  .email({ message: "Please enter a valid email address" })
  .trim()
  .toLowerCase()
  .refine((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), {
    message: "Invalid email format",
  });

/**
 * Password validation schema with strength requirements
 * Enforces minimum length and character variety for security
 */
const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" })
  .max(100, { message: "Password is too long" })
  .refine((password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password), {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  });

/**
 * Schema for user signup validation
 * Validates user input during registration process
 * Ensures passwords match and all fields meet requirements
 */
export const signupSchema = z
  .object({
    // Name validation: must be between 1-50 characters
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .max(50, { message: "Name must be less than 50 characters" })
      .trim(),

    // Email validation with format checking
    email: emailSchema,

    // Password validation with strength requirements
    password: passwordSchema,

    // Confirm password validation
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" })
      .min(6, { message: "Confirm password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Highlights the confirmPassword field for the error
  });

/**
 * Schema for user login validation
 * Validates user input during login process
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
});

/**
 * Type definitions derived from the schemas
 * Used for type checking in components/functions that use these schemas
 */
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
