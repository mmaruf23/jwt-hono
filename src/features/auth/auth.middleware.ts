import { env } from '@/config/env';
import type { JwtPayloadRefreshToken } from '@/types/payload.type';
import type { MiddlewareHandler } from 'hono';
import { getCookie } from 'hono/cookie';
import { verify } from 'hono/jwt';
import z from 'zod';

const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const validateLoginRequest: MiddlewareHandler = async (c, next) => {
  const req = await c.req.json();
  const parse = loginRequestSchema.safeParse(req);

  if (!parse.success)
    return c.json({ message: JSON.parse(parse.error.message)[0] }, 400);

  c.set('loginRequest', parse.data);
  await next();
};

export const validateRefreshToken: MiddlewareHandler = async (c, next) => {
  const token = getCookie(c, 'refresh_token');
  if (!token) return c.json({ message: 'Token not set' }, 400);

  const payload = (await verify(
    token,
    env.JWT_REFRESH_SECRET
  )) as JwtPayloadRefreshToken;

  c.set('payloadRefreshToken', payload);

  await next();
};
