import { z } from 'zod';

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2).max(60).optional(),
    bio: z.string().trim().max(160).optional(),
    acceptsMessages: z.boolean().optional()
  })
  .refine((value) => Object.keys(value).length > 0, 'Change at least one profile setting.');

export const usernameParamSchema = z.object({
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,24}$/)
});

