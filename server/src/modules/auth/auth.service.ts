import bcrypt from 'bcryptjs';
import { env } from '../../config/env.js';
import { AppError } from '../../lib/app-error.js';
import { createOpaqueToken, createVerificationCode, hashValue, secureStringEqual } from '../../lib/crypto.js';
import { sendVerificationEmail } from '../../lib/mailer.js';
import { prisma } from '../../lib/prisma.js';

const verificationLifetimeMs = 10 * 60 * 1000;
const maxVerificationAttempts = 5;

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  bio: string;
  acceptsMessages: boolean;
  emailVerifiedAt: Date | null;
};

function toSafeUser(user: SafeUser): SafeUser {
  return user;
}

async function makeSession(userId: string): Promise<string> {
  const token = createOpaqueToken();
  const expiresAt = new Date(Date.now() + env.SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({
    data: { userId, tokenHash: hashValue(token), expiresAt }
  });
  return token;
}

async function issueVerificationCode(userId: string, email: string): Promise<void> {
  const code = createVerificationCode();
  await prisma.verificationCode.deleteMany({ where: { userId } });
  await prisma.verificationCode.create({
    data: {
      userId,
      codeHash: hashValue(code),
      expiresAt: new Date(Date.now() + verificationLifetimeMs)
    }
  });
  await sendVerificationEmail(email, code);
}

export async function register(input: {
  name: string;
  email: string;
  username: string;
  password: string;
}): Promise<void> {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: input.email }, { username: input.username }] },
    select: { email: true, username: true }
  });
  if (existing?.email === input.email) throw new AppError(409, 'An account already uses this email.');
  if (existing?.username === input.username) throw new AppError(409, 'That username is already taken.');

  const passwordHash = await bcrypt.hash(input.password, 12);
  try {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        username: input.username,
        passwordHash
      },
      select: { id: true, email: true }
    });
    await issueVerificationCode(user.id, user.email);
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      throw new AppError(409, 'That email or username is already in use.');
    }
    throw error;
  }
}

export async function resendVerification(email: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, emailVerifiedAt: true }
  });
  if (!user || user.emailVerifiedAt) return;
  await issueVerificationCode(user.id, user.email);
}

export async function verifyEmail(email: string, code: string): Promise<{
  token: string;
  user: SafeUser;
}> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError(400, 'The code is invalid or has expired.');
  if (user.emailVerifiedAt) throw new AppError(409, 'This email is already verified. Please sign in.');

  const record = await prisma.verificationCode.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });
  if (!record || record.expiresAt <= new Date() || record.attempts >= maxVerificationAttempts) {
    throw new AppError(400, 'The code is invalid or has expired. Request a new one.');
  }

  const matches = secureStringEqual(record.codeHash, hashValue(code));
  if (!matches) {
    const attempts = record.attempts + 1;
    if (attempts >= maxVerificationAttempts) {
      await prisma.verificationCode.delete({ where: { id: record.id } });
      throw new AppError(400, 'Too many incorrect codes. Request a new one.');
    }
    await prisma.verificationCode.update({
      where: { id: record.id },
      data: { attempts }
    });
    throw new AppError(400, 'That code is incorrect. Please try again.');
  }

  const verified = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: new Date() },
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
    await tx.verificationCode.deleteMany({ where: { userId: user.id } });
    return updated;
  });

  return { token: await makeSession(user.id), user: toSafeUser(verified) };
}

export async function login(email: string, password: string): Promise<{
  token: string;
  user: SafeUser;
}> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError(401, 'Email or password is incorrect.');
  }
  if (!user.emailVerifiedAt) {
    throw new AppError(403, 'Verify your email before signing in.');
  }
  const safeUser: SafeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    bio: user.bio,
    acceptsMessages: user.acceptsMessages,
    emailVerifiedAt: user.emailVerifiedAt
  };
  return { token: await makeSession(user.id), user: toSafeUser(safeUser) };
}

export async function logout(sessionId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { id: sessionId } });
}

export async function getSafeUser(userId: string): Promise<SafeUser> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
  if (!user) throw new AppError(404, 'Account not found.');
  return toSafeUser(user);
}

