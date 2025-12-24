import { createMiddleware } from 'hono/factory';
import { object, string, email } from 'zod';

const loginRequestSchema = object({
  email: email(),
  password: string(),
});

export const validLoginRequest = createMiddleware(async (c, next) => {
  const req = await c.req.json();
  const parse = loginRequestSchema.safeParse(req);

  if (!parse.success)
    return c.json({ message: JSON.parse(parse.error.message)[0] }, 400);
  next();
});
