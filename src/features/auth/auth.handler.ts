import { Hono } from 'hono';
import {
  issueAccessToken,
  issueRefreshToken,
  login,
  refresh,
  rotateRefreshToken,
} from './auth.service';
import { loginRequestValidator } from './auth.middleware';
import { jwt } from 'hono/jwt';
import { env } from '@/config/env';
import { setCookie } from 'hono/cookie';
import type { ApiResponse } from '@/types/response.type';
import type { JwtPayloadRefreshToken } from '@/types/payload.type';

export const authRoutes = new Hono()
  // Login Handler
  .post('/login', loginRequestValidator, async (c) => {
    const { email, password } = c.req.valid('json');
    const user = await login(email, password);
    const token = await issueAccessToken(user.id);
    const refreshToken = await issueRefreshToken(user.id);
    setCookie(c, 'refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 60 * 60 * 24 * 30,
    });

    const response: ApiResponse = {
      success: true,
      code: 200,
      data: { token, user },
    };
    return c.json(response, response.code);
  })
  // Refresh Token Handler
  .post(
    '/refresh',
    jwt({ secret: env.JWT_REFRESH_SECRET, cookie: 'refresh_token' }),
    async (c) => {
      const payload = c.get('jwtPayload') as JwtPayloadRefreshToken;
      const refreshToken = await refresh(payload);
      const newRefreshToken = await rotateRefreshToken(refreshToken);
      const token = await issueAccessToken(payload.sub);
      setCookie(c, 'refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/auth/refresh',
        maxAge: 60 * 60 * 24 * 30,
      });

      const response: ApiResponse = {
        success: true,
        code: 200,
        data: { token },
      };

      return c.json(response, response.code);
    }
  )
  // Get Status Jwt
  .get('/status', jwt({ secret: env.JWT_ACCESS_SECRET }), async (c) => {
    const res = c.get('jwtPayload');
    return c.json(res, 200);
  });
