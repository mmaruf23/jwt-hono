import { HTTPException } from 'hono/http-exception';
import { validator } from 'hono/validator';
import z from 'zod';

const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const loginRequestValidator = validator('json', (value) => {
  const parse = loginRequestSchema.safeParse(value);

  if (!parse.success)
    throw new HTTPException(400, {
      message: JSON.parse(parse.error.message)[0] || 'Invalid request',
    });

  return parse.data;
});
