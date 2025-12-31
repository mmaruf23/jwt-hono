import { Hono } from 'hono';
import { authRoutes } from '@/features/auth/auth.handler';
import { userRoutes } from '@/features/user/user.handler';
import { HTTPException } from 'hono/http-exception';
import type { ApiResponse } from '@/types/response.type';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/auth', authRoutes);
app.route('/user', userRoutes);

app.onError((err, c) => {
  if (!(err instanceof HTTPException)) {
    console.error(err.name, err);
    return c.text('INTERNAL SERVER ERROR', 500);
  }

  const response: ApiResponse = {
    success: false,
    code: err.status,
    message: err.message,
  };

  return c.json(response, err.status);
});

export default app;
