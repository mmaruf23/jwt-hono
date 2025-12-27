import { Hono } from 'hono';
import {
  issueAccessToken,
  issueRefreshToken,
  login,
  refresh,
  rotateRefreshToken,
} from './auth.service';
import { validateLoginRequest, validateRefreshToken } from './auth.middleware';
import { jwt } from 'hono/jwt';
import { env } from '@/config/env';
import { setCookie } from 'hono/cookie';
import type { ApiResponse } from '@/types/response.type';

export const authRoutes = new Hono();

authRoutes.post('/login', validateLoginRequest, async (c) => {
  const { email, password } = c.get('loginRequest');
  const user = await login(email, password);
  const token = await issueAccessToken(user.id);
  const refreshToken = await issueRefreshToken(user.id);
  setCookie(c, 'refresh_token', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/auth/refresh',
    maxAge: 60 * 60 * 24 * 30,
  });
  return c.json({ token, user });
});

authRoutes.post('/refresh', validateRefreshToken, async (c) => {
  const payload = c.get('payloadRefreshToken');
  const refreshToken = await refresh(payload);
  const token = await rotateRefreshToken(refreshToken);
  setCookie(c, 'refresh_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/auth/refresh',
    maxAge: 60 * 60 * 24 * 30,
  });
  return c.json({
    success: true,
    code: 200,
    data: 'lihat cookienya apakah berubah?',
  });
});

authRoutes.get('/status', jwt({ secret: env.JWT_ACCESS_SECRET }), async (c) => {
  const res = c.get('jwtPayload');
  return c.json(res, 200);
});
