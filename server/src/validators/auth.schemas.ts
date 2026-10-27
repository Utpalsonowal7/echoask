import { z } from 'zod';

const email = z.string().trim().email().max(254).transform((value) => value.toLowerCase());
const username = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Username must be at least 3 characters.')
  .max(24, 'Username must be 24 characters or fewer.')
  .regex(/^[a-z0-9_]+$/, 'Use only letters, numbers, and underscores in your username.');

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(60),
  email,
  username,
  password: z.string().min(8, 'Password must be at least 8 characters.').max(72)
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password.').max(72)
});

export const verifySchema = z.object({
  email,
  code: z.string().trim().regex(/^[0-9]{6}$/, 'Enter the six-digit code.')
});

export const resendVerificationSchema = z.object({ email });

