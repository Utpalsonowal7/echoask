import { z } from 'zod';

export const createMessageSchema = z.object({
  content: z.string().trim().min(3, 'Write at least 3 characters.').max(1000),
  senderAlias: z.string().trim().max(40).optional().transform((value) => value || undefined)
});

export const messageIdSchema = z.object({
  id: z.string().min(1)
});

