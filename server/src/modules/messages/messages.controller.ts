import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import * as messagesService from './messages.service.js';

export const createMessage = asyncHandler(async (req: Request, res: Response) => {
  const result = await messagesService.createMessage(
    String(req.params.username),
    req.body
  );
  res.status(201).json({ message: 'Your note was sent.', id: result.id });
});

export const getInbox = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.auth?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Please sign in to continue.' });
    return;
  }
  res.json(await messagesService.getInbox(userId));
});

export const markMessageRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.auth?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Please sign in to continue.' });
    return;
  }
  await messagesService.markMessageRead(userId, String(req.params.id));
  res.status(204).send();
});

export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.auth?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Please sign in to continue.' });
    return;
  }
  await messagesService.deleteMessage(userId, String(req.params.id));
  res.status(204).send();
});

