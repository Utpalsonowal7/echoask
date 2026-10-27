import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth.js';
import { publicMessageRateLimit } from '../../middleware/rate-limits.js';
import { validateBody } from '../../middleware/validate-body.js';
import { createMessageSchema } from '../../validators/message.schemas.js';
import * as controller from './messages.controller.js';

export const messagesRouter = Router();

messagesRouter.post(
  '/to/:username',
  publicMessageRateLimit,
  validateBody(createMessageSchema),
  controller.createMessage
);
messagesRouter.get('/inbox', requireAuth, controller.getInbox);
messagesRouter.patch('/:id/read', requireAuth, controller.markMessageRead);
messagesRouter.delete('/:id', requireAuth, controller.deleteMessage);

