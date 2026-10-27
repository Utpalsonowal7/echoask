import { Router } from 'express';
import { authRateLimit } from '../../middleware/rate-limits.js';
import { requireAuth } from '../../middleware/require-auth.js';
import { validateBody } from '../../middleware/validate-body.js';
import * as controller from './auth.controller.js';
import {
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  verifySchema
} from '../../validators/auth.schemas.js';

export const authRouter = Router();

authRouter.post('/register', authRateLimit, validateBody(registerSchema), controller.register);
authRouter.post('/verify', authRateLimit, validateBody(verifySchema), controller.verifyEmail);
authRouter.post(
  '/verify/resend',
  authRateLimit,
  validateBody(resendVerificationSchema),
  controller.resendVerification
);
authRouter.post('/login', authRateLimit, validateBody(loginSchema), controller.login);
authRouter.post('/logout', requireAuth, controller.logout);
authRouter.get('/me', requireAuth, controller.me);

