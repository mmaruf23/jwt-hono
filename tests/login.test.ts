import app from '@/app';
import { describe, expect, it } from 'vitest';

describe('Test login', () => {
  it('should success login', async () => {
    const res = await app.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'inisangatrahasia',
      }),
    });
    expect(res.status).toBe(200);
    const resJson = await res.json();
    expect(resJson.token).toBeTruthy();
  });

  it('should invalid email and blank password', async () => {
    const res = await app.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'ininvalid',
        password: '',
      }),
    });

    expect(res.status).toBe(400);
  });
});
