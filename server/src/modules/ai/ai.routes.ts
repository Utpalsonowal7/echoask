import { Router } from 'express';
import { suggestionRateLimit } from '../../middleware/rate-limits.js';
import { validateBody } from '../../middleware/validate-body.js';
import { suggestionSchema } from '../../validators/ai.schemas.js';
import * as controller from './ai.controller.js';

export const aiRouter = Router();

aiRouter.post(
  '/suggestions',
  suggestionRateLimit,
  validateBody(suggestionSchema),
  controller.suggestions
);

