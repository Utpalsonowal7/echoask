import { AppError } from '../../lib/app-error.js';
import { prisma } from '../../lib/prisma.js';

export async function getPublicProfile(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      name: true,
      username: true,
      bio: true,
      acceptsMessages: true,
      createdAt: true
    }
  });
  if (!user) throw new AppError(404, 'This profile could not be found.');
  return user;
}

export async function updateProfile(
  userId: string,
  data: { name?: string; bio?: string; acceptsMessages?: boolean }
) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      bio: true,
      acceptsMessages: true,
      emailVerifiedAt: true
    }
  });
}

