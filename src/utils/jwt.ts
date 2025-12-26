type JwtCause = {
  name: 'JwtTokenExpired' | 'JwtTokenInvalid';
};

export const isJwtCause = (c: unknown): c is JwtCause => {
  return typeof c === 'object' && c !== null && 'name' in c;
};
