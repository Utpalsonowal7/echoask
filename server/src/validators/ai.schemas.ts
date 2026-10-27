import { z } from 'zod';

export const suggestionSchema = z.object({
  context: z.string().trim().max(160).optional()
});

