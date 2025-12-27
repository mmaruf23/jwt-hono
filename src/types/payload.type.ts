import type { JWTPayload } from 'hono/utils/jwt/types';

export type JwtPayloadRefreshToken = JWTPayload & {
  sub: string;
  jti: string;
};
