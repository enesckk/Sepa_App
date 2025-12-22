const request = require('supertest');
const app = require('../../index');
const { User, Event } = require('../../models');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');

describe('Events API Integration Tests', () => {
  let authToken;
  let testUser;
  let testEvent;

  beforeAll(async () => {
    // Create test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      golbucks: 100,
    });

    // Generate auth token
    authToken = jwt.sign({ userId: testUser.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });
  });

  afterAll(async () => {
    // Cleanup
    if (testUser) await testUser.destroy();
    if (testEvent) await testEvent.destroy();
  });

  describe('GET /api/events', () => {
    it('should get list of events', async () => {
      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data.events)).toBe(true);
    });

    it('should filter events by category', async () => {
      const response = await request(app)
        .get('/api/events?category=kultur')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });
  });

  describe('GET /api/events/:id', () => {
    it('should get event by ID', async () => {
      // Create test event
      testEvent = await Event.create({
        title: 'Test Event',
        description: 'Test Description',
        date: '2024-12-31',
        time: '20:00',
        location: 'Test Location',
        category: 'kultur',
        is_free: true,
        is_active: true,
      });

      const response = await request(app)
        .get(`/api/events/${testEvent.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.event).toHaveProperty('id', testEvent.id);
    });

    it('should return 404 for non-existent event', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app).get(`/api/events/${fakeId}`).expect(404);
    });
  });

  describe('POST /api/events/:id/register', () => {
    it('should register user for event', async () => {
      if (!testEvent) {
        testEvent = await Event.create({
          title: 'Test Event',
          description: 'Test Description',
          date: '2024-12-31',
          time: '20:00',
          location: 'Test Location',
          category: 'kultur',
          is_free: true,
          is_active: true,
        });
      }

      const response = await request(app)
        .post(`/api/events/${testEvent.id}/register`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
    });

    it('should require authentication', async () => {
      await request(app)
        .post(`/api/events/${testEvent.id}/register`)
        .expect(401);
    });
  });
});

