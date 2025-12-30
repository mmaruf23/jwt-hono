import 'hono';
import type { StatusCode } from 'hono/utils/http-status';
import type { JWTPayload } from 'hono/utils/jwt/types';
import type { UpdateProfileRequest } from './payload.type';

declare module 'hono' {
  interface ContextVariableMap {
    loginRequest: {
      email: string;
      password: string;
    };
    jwtPayload: JWTPayload;
    updateProfileRequest: UpdateProfileRequest;
  }
}
