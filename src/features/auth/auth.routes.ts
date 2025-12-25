import { Hono } from 'hono';
import { login } from './auth.service';
import type { loginRequest } from '@/features/auth/auth.types';
import { validator } from 'hono/validator';
import { validLoginRequest } from './auth.middleware';

export const authRoutes = new Hono();

authRoutes.post('/login', validLoginRequest, async (c) => {
  const { email, password } = (await c.req.json()) as loginRequest;
  const token = await login(email, password);
  return c.json({ token });
});
