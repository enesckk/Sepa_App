const request = require('supertest');
const app = require('../index');

/**
 * Integration tests that don't require database
 * These test the API structure and error handling
 */
describe('API Integration Tests (No Database Required)', () => {
  describe('Root Endpoints', () => {
    it('GET / should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('running');
      expect(response.body).toHaveProperty('endpoints');
    });

    it('GET /health should return health check', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
    });

    it('GET /api should return API documentation', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.endpoints).toHaveProperty('auth');
      expect(response.body.endpoints).toHaveProperty('users');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent-route')
        .expect(404);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Not Found');
    });

    it('should return validation error for invalid register request', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          // Missing required fields
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Validation Error');
      expect(response.body).toHaveProperty('errors');
    });

    it('should return validation error for invalid login request', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          // Missing password
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Validation Error');
    });

    it('should return 401 for protected routes without token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Unauthorized');
      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 for protected routes with invalid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid-token-here')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  describe('Request Validation', () => {
    it('should validate email format in register', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'not-an-email',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(response.body.errors).toBeDefined();
    });

    it('should validate password length in register', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: '12345', // Too short
        })
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });

    it('should validate name length in register', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'A', // Too short
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('API Structure', () => {
    it('should have correct response structure for errors', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
    });

    it('should have correct response structure for validation errors', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);
    });
  });
});

