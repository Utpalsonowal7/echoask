import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth.js';
import { validateBody } from '../../middleware/validate-body.js';
import { updateProfileSchema } from '../../validators/profile.schemas.js';
import * as controller from './profiles.controller.js';

export const profilesRouter = Router();

profilesRouter.get('/:username', controller.getPublicProfile);
profilesRouter.patch('/me', requireAuth, validateBody(updateProfileSchema), controller.updateProfile);

