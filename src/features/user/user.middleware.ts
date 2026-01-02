import type { MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { validator } from 'hono/validator';
import z from 'zod';

const updateProfilSchema = z.object({
  name: z.string().min(3),
});

export const updateRequestValidator = validator('json', (value) => {
  const parsed = updateProfilSchema.safeParse(value);
  if (!parsed.success) {
    throw new HTTPException(400, {
      message: JSON.parse(parsed.error.message)[0] ?? 'Invalid request',
    });
  }

  return parsed.data;
});
