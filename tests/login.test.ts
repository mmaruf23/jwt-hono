import app from '@/app';
import { equal, ok } from 'node:assert';
import { describe, it } from 'node:test';

describe('Test login', () => {
  it('should success login', async () => {
    const res = await app.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'inisangatrahasia',
      }),
    });
    equal(res.status, 200);
    const resJson = await res.json();
    ok(resJson.token);
    console.log(resJson);
  });
});
