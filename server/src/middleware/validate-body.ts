import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../lib/app-error.js';

export function validateBody(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      next(new AppError(400, parsed.error.issues[0]?.message ?? 'Invalid request.'));
      return;
    }
    req.body = parsed.data;
    next();
  };
}

