import 'hono';
import type { StatusCode } from 'hono/utils/http-status';
import type { JwtPayloadRefreshToken } from './payload.type';

declare module 'hono' {
  interface ContextVariableMap {
    loginRequest: {
      email: string;
      password: string;
    };
    payloadRefreshToken: JwtPayloadRefreshToken;
  }
}
