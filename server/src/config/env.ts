import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  SESSION_COOKIE_NAME: z.string().default('echoask_session'),
  SESSION_DAYS: z.coerce.number().int().positive().default(14),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-3.5-flash-lite'),
  MAIL_MODE: z.enum(['console', 'smtp']).default('console'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  MAIL_FROM: z.string().default('EchoAsk <no-reply@example.com>')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid server environment:', parsed.error.flatten().fieldErrors);
  throw new Error('Fix the server environment variables and restart EchoAsk.');
}

export const env = {
  ...parsed.data,
  allowedOrigins: parsed.data.CLIENT_ORIGIN
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
};

