import { env } from '@/config/env';
import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { getProfile, updateProfile } from './user.service';
import type { ApiResponse } from '@/types/response.type';
import type { JwtPayloadAccessToken } from '@/types/payload.type';
import { validateUpdateRequest } from './user.middleware';

export const userRoutes = new Hono();

userRoutes.get('/me', jwt({ secret: env.JWT_ACCESS_SECRET }), async (c) => {
  const sub = c.get('jwtPayload') as JwtPayloadAccessToken;
  const user = await getProfile(sub.sub);

  const response: ApiResponse = { success: true, code: 200, data: user };
  return c.json(response, response.code);
});

userRoutes.patch(
  '/me',
  jwt({ secret: env.JWT_ACCESS_SECRET }),
  validateUpdateRequest,
  async (c) => {
    const jwtPayload = c.get('jwtPayload') as JwtPayloadAccessToken;
    const { name } = c.get('updateProfileRequest');
    await updateProfile(jwtPayload.sub, name);

    const response: ApiResponse = { success: true, code: 200 };
    return c.json(response, response.code);
  }
);
