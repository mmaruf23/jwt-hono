import { HTTPException } from 'hono/http-exception';

export const NewUserNotFoundError = (id?: string) => {
  return new HTTPException(404, {
    message: id ? `User with id : ${id} not found` : 'User not found',
  });
};
