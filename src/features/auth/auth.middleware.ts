import type { MiddlewareHandler } from 'hono';
import { jwt } from 'hono/jwt';
import { object, string, email } from 'zod';

const loginRequestSchema = object({
  email: email(),
  password: string(),
});

export const validateLoginRequest: MiddlewareHandler = async (c, next) => {
  const req = await c.req.json();
  const parse = loginRequestSchema.safeParse(req);

  if (!parse.success)
    return c.json({ message: JSON.parse(parse.error.message)[0] }, 400);
  await next();
};
