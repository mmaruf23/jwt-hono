import type { ApiResponse } from '@/types/response.type';
import type { ErrorHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const errorHandler: ErrorHandler = (err, c) => {
  if (!(err instanceof HTTPException)) {
    console.error(err.name, err);
    return c.text('INTERNAL SERVER ERROR', 500);
  }

  console.log(err.cause);
  const response: ApiResponse = {
    success: false,
    code: err.status,
    message: err.message,
  };

  return c.json(response, err.status);
};
