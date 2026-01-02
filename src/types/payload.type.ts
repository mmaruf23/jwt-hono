import type { JWTPayload } from 'hono/utils/jwt/types';

export type JwtPayloadAccessToken = JWTPayload & {
  sub: string;
};

export type JwtPayloadRefreshToken = JwtPayloadAccessToken & {
  jti: string;
};
