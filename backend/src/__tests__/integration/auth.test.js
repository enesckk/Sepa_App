const request = require('supertest');
const app = require('../../index');
const { User } = require('../../models');

describe('Auth API Integration Tests', () => {
  let testUser;

  afterAll(async () => {
    // Cleanup
    if (testUser) await testUser.destroy();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'New User',
        email: `newuser${Date.now()}@example.com`,
        password: 'password123',
        phone: '5551234567',
        mahalle: 'Test Mahalle',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');

      // Store for cleanup
      testUser = await User.findByPk(response.body.data.user.id);
    });

    it('should reject duplicate email', async () => {
      const userData = {
        name: 'Duplicate User',
        email: testUser.email,
        password: 'password123',
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });

    it('should validate required fields', async () => {
      const userData = {
        name: 'Incomplete User',
        // Missing email and password
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: testUser.email,
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('should reject invalid credentials', async () => {
      const loginData = {
        email: testUser.email,
        password: 'wrongpassword',
      };

      await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user with valid token', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'password123',
        });

      const token = loginResponse.body.data.accessToken;

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.user).toHaveProperty('id', testUser.id);
      expect(response.body.data.user).toHaveProperty('email', testUser.email);
    });

    it('should reject request without token', async () => {
      await request(app).get('/api/auth/me').expect(401);
    });
  });
});

