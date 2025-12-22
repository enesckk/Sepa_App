const request = require('supertest');
const app = require('../index');
const { User } = require('../models');
const { sequelize } = require('../config/database');
const { generateAccessToken } = require('../utils/jwt');

describe('User API Tests', () => {
  let testUser;
  let accessToken;

  // Before all tests: Create test user
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
      
      // Create test user
      testUser = await User.create({
        name: 'Test User',
        email: 'usertest@example.com',
        password: 'password123',
        phone: '05551234567',
        mahalle: 'Test Mahalle',
        golbucks: 100,
      });

      accessToken = generateAccessToken(testUser);
    } catch (error) {
      console.error('Setup error:', error);
    }
  });

  // After all tests: Cleanup
  afterAll(async () => {
    try {
      if (testUser) {
        await User.destroy({ where: { email: 'usertest@example.com' } });
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  });

  describe('GET /api/users/profile', () => {
    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('usertest@example.com');
      expect(response.body.data.user.name).toBe('Test User');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile with valid data', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Updated Name',
          phone: '05559876543',
          mahalle: 'Updated Mahalle',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe('Updated Name');
      expect(response.body.data.user.phone).toBe('05559876543');
      expect(response.body.data.user.mahalle).toBe('Updated Mahalle');
    });

    it('should update only name', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'New Name',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe('New Name');
    });

    it('should fail with invalid name length', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'A', // Too short
        })
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .send({
          name: 'Test',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/golbucks', () => {
    it('should get user golbucks balance', async () => {
      const response = await request(app)
        .get('/api/users/golbucks')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('golbucks');
      expect(typeof response.body.data.golbucks).toBe('number');
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/api/users/golbucks')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/password', () => {
    it('should update password with correct current password', async () => {
      const response = await request(app)
        .put('/api/users/password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword123',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Password updated successfully');

      // Verify new password works
      await testUser.reload();
      const isPasswordValid = await testUser.comparePassword('newpassword123');
      expect(isPasswordValid).toBe(true);
    });

    it('should fail with incorrect current password', async () => {
      const response = await request(app)
        .put('/api/users/password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword123',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('UnauthorizedError');
    });

    it('should fail with short new password', async () => {
      const response = await request(app)
        .put('/api/users/password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'newpassword123',
          newPassword: '12345', // Too short
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('ValidationError');
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .put('/api/users/password')
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword123',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});

