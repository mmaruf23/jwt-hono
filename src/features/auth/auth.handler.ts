import { Hono } from 'hono';
import { login } from './auth.service';
import type { loginRequest } from '@/features/auth/auth.types';
import { validateLoginRequest } from './auth.middleware';
import { jwt } from 'hono/jwt';
import { envNode } from '@/config/env';

export const authRoutes = new Hono();

authRoutes.post('/login', validateLoginRequest, async (c) => {
  const { email, password } = (await c.req.json()) as loginRequest;
  const token = await login(email, password);
  return c.json({ token });
});

authRoutes.get('/status', jwt({ secret: envNode.JWT_SECRET }), async (c) => {
  const res = c.get('jwtPayload');
  return c.json(res, 200);
});
