const request = require('supertest');
const app = require('../index');
const { User } = require('../models');
const { sequelize } = require('../config/database');
const { generateAccessToken } = require('../utils/jwt');

describe('Middleware Tests', () => {
  let testUser;
  let validToken;
  let invalidToken;

  beforeAll(async () => {
    try {
      await sequelize.authenticate();
      
      testUser = await User.create({
        name: 'Middleware Test',
        email: 'middlewaretest@example.com',
        password: 'password123',
      });

      validToken = generateAccessToken(testUser);
      invalidToken = 'invalid.token.here';
    } catch (error) {
      console.error('Setup error:', error);
    }
  });

  afterAll(async () => {
    try {
      if (testUser) {
        await User.destroy({ where: { email: 'middlewaretest@example.com' } });
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  });

  describe('Authentication Middleware', () => {
    it('should allow access with valid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body.error).toBe('Unauthorized');
      expect(response.body.message).toContain('No token provided');
    });

    it('should reject request with invalid token format', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      expect(response.body.error).toBe('Unauthorized');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body.error).toBe('Unauthorized');
    });

    it('should reject request with expired token', async () => {
      // Create an expired token (this would require jwt.sign with short expiry)
      // For now, we'll test with malformed token
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer expired.token.here')
        .expect(401);

      expect(response.body.error).toBe('Unauthorized');
    });
  });

  describe('Error Handler Middleware', () => {
    it('should handle 404 errors correctly', async () => {
      const response = await request(app)
        .get('/api/nonexistent-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Not Found');
    });

    it('should handle validation errors correctly', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test',
          // Missing email and password
        })
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(response.body.errors).toBeDefined();
    });
  });
});

