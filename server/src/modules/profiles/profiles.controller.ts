import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import * as profilesService from './profiles.service.js';

export const getPublicProfile = asyncHandler(async (req: Request, res: Response) => {
  res.json({ profile: await profilesService.getPublicProfile(String(req.params.username)) });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.auth?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Please sign in to continue.' });
    return;
  }
  res.json({ user: await profilesService.updateProfile(userId, req.body) });
});

