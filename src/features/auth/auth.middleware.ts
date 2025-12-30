import { env } from '@/config/env';
import type { JwtPayloadRefreshToken } from '@/types/payload.type';
import type { MiddlewareHandler } from 'hono';
import { getCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
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
    throw new HTTPException(400, {
      message: JSON.parse(parse.error.message)[0] || 'Invalid request',
    });
  c.set('loginRequest', parse.data);
  await next();
};

export const validateRefreshToken: MiddlewareHandler = async (c, next) => {
  const token = getCookie(c, 'refresh_token');
  if (!token) return c.json({ message: 'Token not set' }, 400);

  let payload: JwtPayloadRefreshToken;
  try {
    payload = (await verify(
      token,
      env.JWT_REFRESH_SECRET
    )) as JwtPayloadRefreshToken;
  } catch (error) {
    if (error instanceof Error) console.log(error.name, error.message);
    throw new HTTPException(401, {
      message: 'Unauthorized',
    });
  }

  c.set('payloadRefreshToken', payload);

  await next();
};
