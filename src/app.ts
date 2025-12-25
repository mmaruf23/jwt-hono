import { Hono } from 'hono';
import { authRoutes } from '@/features/auth/auth.handler';
import { envNode, type EnvSchema } from '@/config/env';

const app = new Hono<{ Variables: { env: EnvSchema } }>();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/env', (c) => {
  return c.json(envNode, 200);
});

app.route('/auth', authRoutes);

app.onError((err, c) => {
  return c.json({ error: err.message }, 500);
});

export default app;
