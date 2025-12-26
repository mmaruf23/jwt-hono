import { Hono } from 'hono';
import { issueAccessToken, issueRefreshToken, login } from './auth.service';
import { validateLoginRequest } from './auth.middleware';
import { jwt } from 'hono/jwt';
import { env } from '@/config/env';
import { getCookie, setCookie } from 'hono/cookie';

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
    path: '/auth/refresh', // todo : bikin endpoint nya
    maxAge: 60 * 60 * 24 * 30, // detik
  });
  return c.json({ token, user });
});

authRoutes.post('/refresh', async (c) => {
  const token = getCookie(c, 'refresh_token');
  return c.text('belom kelar hehe. nih token lama kau' + token, 200);
  // todo : lanjut disini
});

authRoutes.get('/status', jwt({ secret: env.JWT_ACCESS_SECRET }), async (c) => {
  const res = c.get('jwtPayload');
  return c.json(res, 200);
});
