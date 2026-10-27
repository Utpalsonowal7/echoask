import { AppError } from '../../lib/app-error.js';
import { prisma } from '../../lib/prisma.js';

export async function createMessage(
  username: string,
  input: { content: string; senderAlias?: string }
) {
  const recipient = await prisma.user.findUnique({
    where: { username },
    select: { id: true, acceptsMessages: true }
  });
  if (!recipient) throw new AppError(404, 'This profile could not be found.');
  if (!recipient.acceptsMessages) throw new AppError(403, 'This person is not accepting messages right now.');

  const message = await prisma.message.create({
    data: {
      recipientId: recipient.id,
      content: input.content,
      senderAlias: input.senderAlias ?? null
    },
    select: { id: true, createdAt: true }
  });
  return message;
}

export async function getInbox(userId: string) {
  const [messages, unreadCount] = await Promise.all([
    prisma.message.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        senderAlias: true,
        isRead: true,
        createdAt: true
      }
    }),
    prisma.message.count({ where: { recipientId: userId, isRead: false } })
  ]);
  return { messages, unreadCount };
}

export async function markMessageRead(userId: string, messageId: string): Promise<void> {
  const result = await prisma.message.updateMany({
    where: { id: messageId, recipientId: userId },
    data: { isRead: true }
  });
  if (!result.count) throw new AppError(404, 'Message not found.');
}

export async function deleteMessage(userId: string, messageId: string): Promise<void> {
  const result = await prisma.message.deleteMany({
    where: { id: messageId, recipientId: userId }
  });
  if (!result.count) throw new AppError(404, 'Message not found.');
}

