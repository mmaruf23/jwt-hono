import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { authRoutes } from './features/auth/auth.routes';
import { logger } from 'hono/logger';

const app = new Hono();

app.use(logger());

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/auth', authRoutes);

app.onError((err, c) => {
  return c.json({ error: err.message }, 500);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
