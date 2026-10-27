import { rateLimit } from 'express-rate-limit';

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many account requests. Please wait and try again.' }
});

export const publicMessageRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Please wait a moment before sending another message.' }
});

export const suggestionRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 12,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many suggestion requests. Try again shortly.' }
});

