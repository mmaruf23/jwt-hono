import { Hono } from 'hono';
import { authRoutes } from '@/features/auth/auth.routes';
import { logger } from 'hono/logger';
import { envMiddleware } from '@/middlewares/env.middleware';
import type { EnvSchema } from './config/env';

const app = new Hono<{ Variables: { env: EnvSchema } }>();

app.use(logger());
app.use('*', envMiddleware);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/env', (c) => {
  const envValue = c.get('env');
  return c.json(envValue, 200);
});

app.route('/auth', authRoutes);

app.onError((err, c) => {
  return c.json({ error: err.message }, 500);
});

export default app;
