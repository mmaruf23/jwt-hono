import { Hono } from 'hono';
import { authRoutes } from '@/features/auth/auth.handler';
import { userRoutes } from '@/features/user/user.handler';
import { errorHandler } from './features/error/error.handler';

const app = new Hono()
  .route('/auth', authRoutes)
  .route('/user', userRoutes)
  .onError(errorHandler);

export default app;

export type AppType = typeof app;
