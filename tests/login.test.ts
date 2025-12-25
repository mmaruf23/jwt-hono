import app from '@/app';
import { describe, expect, it } from 'vitest';
import { email } from 'zod';

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

  it('should authorize', async () => {
    const loginRequest = await app.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'inisangatrahasia',
      }),
    });

    expect(loginRequest.status).toBe(200);
    const { token } = (await loginRequest.json()) as { token: string };
    expect(token).toBeDefined();

    const res = await app.request('/auth/status', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.status).toBe(200);
    const resJson = await res.json();
    expect(resJson).toBeDefined();
  });
});
