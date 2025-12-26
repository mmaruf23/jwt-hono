import { db } from '@/config/db';
import {
  refreshTokens,
  type RefreshToken,
} from '@/config/db/schema/refreshTokens';
import { users, type User } from '@/config/db/schema/users';
import { env } from '@/config/env';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { sign } from 'hono/jwt';
import { randomUUID } from 'node:crypto';

export const login = async (
  email: string,
  password: string
): Promise<Omit<User, 'passwordHash'>> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (!user) throw new Error('Invalid credentials');
  const { passwordHash, ...rest } = user;
  const ok = bcrypt.compareSync(password, passwordHash);
  if (!ok) throw new Error('Invalid credentials');

  return rest;
};

export const issueAccessToken = async (sub: string): Promise<string> => {
  const exp = Math.floor(Date.now() / 1000) + 60 * 10;
  return await sign({ sub, exp }, env.JWT_ACCESS_SECRET);
};

export const issueRefreshToken = async (sub: string) => {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  const refreshTokenId = randomUUID();
  const token = await sign(
    {
      sub,
      jti: refreshTokenId,
      exp: Math.floor(expiresAt.getTime() / 1000),
    },
    env.JWT_REFRESH_SECRET
  );

  await db.insert(refreshTokens).values({
    id: refreshTokenId,
    userId: sub,
    expiresAt,
  });

  return token;
};
