import { db } from '@/config/db';
import {
  refreshTokens,
  type RefreshToken,
} from '@/config/db/schema/refreshTokens';
import { users, type User } from '@/config/db/schema/users';
import { env } from '@/config/env';
import type { JwtPayloadRefreshToken } from '@/types/payload.type';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { sign } from 'hono/jwt';
import { randomUUID } from 'node:crypto';
import {
  NewInvalidTokenError,
  NewCredentialError,
  NewExpiredTokenError,
  NewReplacedTokenError,
  NewRevokedTokenError,
} from './auth.exception';

export const login = async (
  email: string,
  password: string
): Promise<Omit<User, 'passwordHash'>> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (!user) throw NewCredentialError();
  const { passwordHash, ...rest } = user;
  const ok = bcrypt.compareSync(password, passwordHash);
  if (!ok) throw NewCredentialError();

  return rest;
};

export const refresh = async (payload: JwtPayloadRefreshToken) => {
  const refreshToken = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.id, payload.jti))
    .get();

  if (!refreshToken) throw NewInvalidTokenError();
  if (refreshToken.replacedBy) throw NewReplacedTokenError(); // todo : revoke semua refresh token dengan id yang sama.
  if (refreshToken.revokedAt) throw NewRevokedTokenError();
  if (refreshToken.expiresAt < new Date()) throw NewExpiredTokenError(); // just in case

  return refreshToken;
};

export const issueAccessToken = async (sub: string): Promise<string> => {
  const exp = Math.floor(Date.now() / 1000) + 60 * 10;
  return await sign({ sub, exp }, env.JWT_ACCESS_SECRET);
};

export const issueRefreshToken = async (sub: string) => {
  const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 30);

  const refreshTokenId = randomUUID();
  const payload: JwtPayloadRefreshToken = {
    sub,
    jti: refreshTokenId,
    exp: Math.floor(expiresAt.getTime() / 1000),
  };
  const token = await sign(payload, env.JWT_REFRESH_SECRET);

  await db.insert(refreshTokens).values({
    id: refreshTokenId,
    userId: sub,
    expiresAt,
  });

  return token;
};

export const rotateRefreshToken = async (refreshTokenOld: RefreshToken) => {
  const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 30);

  const newJti = randomUUID();
  const payload: JwtPayloadRefreshToken = {
    sub: refreshTokenOld.userId,
    jti: newJti,
    exp: Math.floor(expiresAt.getTime() / 1000),
  };
  const token = await sign(payload, env.JWT_REFRESH_SECRET);

  await db.transaction(async (tx) => {
    await tx
      .update(refreshTokens)
      .set({
        revokedAt: new Date(),
        replacedBy: newJti,
      })
      .where(eq(refreshTokens.id, refreshTokenOld.id));

    await tx.insert(refreshTokens).values({
      id: newJti,
      userId: refreshTokenOld.userId,
      expiresAt: expiresAt,
    });
  });

  return token;
};
