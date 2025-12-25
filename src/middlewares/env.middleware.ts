import { envNode } from '@/config/env';
import type { MiddlewareHandler } from 'hono';

export const envMiddleware: MiddlewareHandler = async (c, next) => {
  c.set('env', envNode);
  await next();
};
