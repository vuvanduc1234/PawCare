import request from 'supertest';
import app from '../src/app.js';

const registerAndLogin = async (payload) => {
  await request(app).post('/api/auth/register').send(payload);
  const loginRes = await request(app).post('/api/auth/login').send({
    email: payload.email,
    password: payload.password,
  });
  return loginRes.body.data.accessToken;
};

describe('Pet API', () => {
  test('create pet success', async () => {
    const token = await registerAndLogin({
      fullName: 'User A',
      email: 'usera@example.com',
      password: 'Password123',
      phone: '0900000001',
    });

    const res = await request(app)
      .post('/api/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Milu',
        type: 'dog',
        breed: 'Poodle',
        age: 2,
        weight: 4.5,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data?.name).toBe('Milu');
  });

  test('cannot update pet of another user', async () => {
    const tokenA = await registerAndLogin({
      fullName: 'User A',
      email: 'usera@example.com',
      password: 'Password123',
      phone: '0900000001',
    });

    const tokenB = await registerAndLogin({
      fullName: 'User B',
      email: 'userb@example.com',
      password: 'Password123',
      phone: '0900000002',
    });

    const createRes = await request(app)
      .post('/api/pets')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        name: 'Tom',
        type: 'cat',
        breed: 'Persian',
        age: 3,
        weight: 3.2,
      });

    const petId = createRes.body.data._id;

    const updateRes = await request(app)
      .put(`/api/pets/${petId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ name: 'Tommy' });

    expect(updateRes.status).toBe(403);
    expect(updateRes.body.success).toBe(false);
  });
});
