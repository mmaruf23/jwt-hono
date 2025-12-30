import { HTTPException } from 'hono/http-exception';
import {
  JwtTokenExpired,
  JwtTokenNotBefore,
  JwtAlgorithmNotImplemented,
  JwtTokenInvalid,
  JwtTokenIssuedAt,
  JwtTokenIssuer,
  JwtTokenSignatureMismatched,
} from 'hono/utils/jwt/types';

export function handleJwtError(err: unknown): HTTPException | null {
  if (err instanceof JwtTokenExpired)
    throw new HTTPException(401, { message: 'Token expired' });

  if (err instanceof JwtTokenNotBefore)
    throw new HTTPException(401, { message: 'Token not active yet' });

  if (err instanceof JwtTokenIssuedAt || err instanceof JwtTokenIssuer)
    throw new HTTPException(401, { message: 'Invalid token claim' });

  if (err instanceof JwtAlgorithmNotImplemented)
    throw new HTTPException(500, { message: 'JWT algorithm not supported' });

  if (
    err instanceof JwtTokenInvalid ||
    err instanceof JwtTokenSignatureMismatched
  )
    throw new HTTPException(401, { message: 'Invalid token' });

  throw new HTTPException(401, { message: 'Invalid token' });
}
