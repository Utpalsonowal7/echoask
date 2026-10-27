import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../lib/app-error.js';

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({ error: error.issues[0]?.message ?? 'Invalid request.' });
    return;
  }

  console.error('Unhandled API error:', error);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
};

