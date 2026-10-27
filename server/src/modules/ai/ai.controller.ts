import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { generateMessageSuggestions } from '../../lib/gemini.js';

export const suggestions = asyncHandler(async (req: Request, res: Response) => {
  const { context } = req.body as { context?: string };
  res.json({ suggestions: await generateMessageSuggestions(context) });
});

