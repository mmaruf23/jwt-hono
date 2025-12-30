import type { MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import z from 'zod';

const updateProfilSchema = z.object({
  name: z.string().min(3),
});

export const validateUpdateRequest: MiddlewareHandler = async (c, next) => {
  const req = await c.req.json();
  const parsed = updateProfilSchema.safeParse(req);
  if (!parsed.success)
    throw new HTTPException(400, {
      message: JSON.parse(parsed.error.message)[0] ?? 'Invalid request',
    });

  c.set('updateProfileRequest', parsed.data);
  await next();
};
