import { HTTPException } from 'hono/http-exception';

export const NewCredentialError = () => {
  return new HTTPException(400, {
    message: 'Invalid credential',
  });
};

export const NewInvalidTokenError = () => {
  return new HTTPException(400, {
    message: 'Token tidak valid',
  });
};

export const NewExpiredTokenError = () => {
  return new HTTPException(400, {
    message: 'Token expired',
  });
};
export const NewReplacedTokenError = () => {
  return new HTTPException(400, {
    message: 'Token sudah terpakai',
  });
};
export const NewRevokedTokenError = () => {
  return new HTTPException(400, {
    message: 'Token sudah tidak aktif',
  });
};
