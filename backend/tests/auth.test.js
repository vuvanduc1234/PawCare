import request from 'supertest';
import app from '../src/app.js';

const registerUser = async (overrides = {}) => {
  const payload = {
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'Password123',
    phone: '0900000000',
    ...overrides,
  };
  return request(app).post('/api/auth/register').send(payload);
};

describe('Auth API', () => {
  test('register success', async () => {
    const res = await registerUser();
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data?.accessToken).toBeTruthy();
  });

  test('register fails for duplicate email', async () => {
    await registerUser();
    const res = await registerUser();
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('register fails for missing field', async () => {
    const res = await registerUser({ email: '' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('login success', async () => {
    await registerUser();
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'Password123',
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data?.accessToken).toBeTruthy();
  });

  test('login fails with wrong password', async () => {
    await registerUser();
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'WrongPassword',
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('protected route requires token', async () => {
    const res = await request(app).get('/api/pets');
    expect(res.status).toBe(401);
  });
});
