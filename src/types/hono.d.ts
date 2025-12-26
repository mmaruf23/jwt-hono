import 'hono';
import type { StatusCode } from 'hono/utils/http-status';

declare module 'hono' {
  interface ContextVariableMap {
    loginRequest: {
      email: string;
      password: string;
    };
  }
}
