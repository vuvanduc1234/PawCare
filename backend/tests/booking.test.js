import request from 'supertest';
import app from '../src/app.js';
import Service from '../src/models/Service.js';

const registerAndLogin = async (payload) => {
  await request(app).post('/api/auth/register').send(payload);
  const loginRes = await request(app).post('/api/auth/login').send({
    email: payload.email,
    password: payload.password,
  });
  return loginRes.body.data.accessToken;
};

describe('Booking API', () => {
  test('create booking success', async () => {
    const userToken = await registerAndLogin({
      fullName: 'User C',
      email: 'userc@example.com',
      password: 'Password123',
      phone: '0900000003',
    });

    const providerToken = await registerAndLogin({
      fullName: 'Provider 1',
      email: 'provider1@example.com',
      password: 'Password123',
      phone: '0900000004',
      role: 'provider',
    });

    const providerUser = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${providerToken}`);

    const service = await Service.create({
      provider: providerUser.body.data._id,
      name: 'Grooming Basic',
      category: 'grooming',
      description: 'Basic grooming service',
      price: 200000,
      duration: 60,
      address: '123 Street',
      latitude: 10.1,
      longitude: 106.1,
      city: 'HCM',
    });

    const petRes = await request(app)
      .post('/api/pets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Bun',
        type: 'dog',
        breed: 'Pug',
        age: 2,
        weight: 5,
      });

    const bookingRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        serviceId: service._id,
        petId: petRes.body.data._id,
        bookingDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        timeSlot: '09:00',
        notes: 'Please take care',
      });

    expect(bookingRes.status).toBe(201);
    expect(bookingRes.body.success).toBe(true);
  });

  test('booking conflict returns error', async () => {
    const userToken = await registerAndLogin({
      fullName: 'User D',
      email: 'userd@example.com',
      password: 'Password123',
      phone: '0900000005',
    });

    const providerToken = await registerAndLogin({
      fullName: 'Provider 2',
      email: 'provider2@example.com',
      password: 'Password123',
      phone: '0900000006',
      role: 'provider',
    });

    const providerUser = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${providerToken}`);

    const service = await Service.create({
      provider: providerUser.body.data._id,
      name: 'Vet Check',
      category: 'clinic',
      description: 'Health check',
      price: 300000,
      duration: 60,
      address: '456 Street',
      latitude: 10.2,
      longitude: 106.2,
      city: 'HCM',
    });

    const petRes = await request(app)
      .post('/api/pets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Luna',
        type: 'cat',
        breed: 'Bengal',
        age: 1,
        weight: 3,
      });

    const bookingDate = new Date(Date.now() + 48 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        serviceId: service._id,
        petId: petRes.body.data._id,
        bookingDate,
        timeSlot: '10:00',
        notes: 'First booking',
      });

    const conflictRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        serviceId: service._id,
        petId: petRes.body.data._id,
        bookingDate,
        timeSlot: '10:00',
        notes: 'Second booking',
      });

    expect(conflictRes.status).toBe(400);
    expect(conflictRes.body.success).toBe(false);
  });
});
