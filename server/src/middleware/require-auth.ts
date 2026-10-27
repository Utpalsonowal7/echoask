import type { RequestHandler } from 'express';
import { env } from '../config/env.js';
import { AppError } from '../lib/app-error.js';
import { hashValue } from '../lib/crypto.js';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from './async-handler.js';

export const requireAuth: RequestHandler = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.[env.SESSION_COOKIE_NAME] as string | undefined;
  if (!token) throw new AppError(401, 'Please sign in to continue.');

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashValue(token) },
    select: { id: true, userId: true, expiresAt: true }
  });

  if (!session || session.expiresAt <= new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    throw new AppError(401, 'Your session has expired. Please sign in again.');
  }

  req.auth = { userId: session.userId, sessionId: session.id };
  next();
});

