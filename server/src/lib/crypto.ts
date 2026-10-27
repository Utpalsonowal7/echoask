import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';

export function hashValue(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function createOpaqueToken(): string {
  return randomBytes(32).toString('base64url');
}

export function createVerificationCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, '0');
}

export function secureStringEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

