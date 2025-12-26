import type { MiddlewareHandler } from 'hono';
import z from 'zod';

const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const validateLoginRequest: MiddlewareHandler = async (c, next) => {
  const req = await c.req.json();
  const parse = loginRequestSchema.safeParse(req);

  if (!parse.success)
    return c.json({ message: JSON.parse(parse.error.message)[0] }, 400);

  c.set('loginRequest', parse.data);
  await next();
};
