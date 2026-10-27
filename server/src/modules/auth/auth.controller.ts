import { asyncHandler } from '../../middleware/async-handler.js';
import { clearSessionCookie, setSessionCookie } from '../../lib/cookies.js';
import * as authService from './auth.service.js';

export const register = asyncHandler(async (req, res) => {
  await authService.register(req.body as Parameters<typeof authService.register>[0]);
  res.status(201).json({ message: 'Check your email for a verification code.' });
});

export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body as { email: string };
  await authService.resendVerification(email);
  res.json({ message: 'If the account needs verification, a new code has been sent.' });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body as { email: string; code: string };
  const result = await authService.verifyEmail(email, code);
  setSessionCookie(res, result.token);
  res.json({ user: result.user });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const result = await authService.login(email, password);
  setSessionCookie(res, result.token);
  res.json({ user: result.user });
});

export const logout = asyncHandler(async (req, res) => {
  if (req.auth) await authService.logout(req.auth.sessionId);
  clearSessionCookie(res);
  res.status(204).send();
});

export const me = asyncHandler(async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Please sign in to continue.' });
    return;
  }
  res.json({ user: await authService.getSafeUser(userId) });
});

