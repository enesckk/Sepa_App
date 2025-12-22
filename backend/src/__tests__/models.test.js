const { User } = require('../models');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

describe('User Model Tests', () => {
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
    } catch (error) {
      console.error('Database connection error:', error);
    }
  });

  afterAll(async () => {
    try {
      await sequelize.close();
    } catch (error) {
      console.error('Close error:', error);
    }
  });

  describe('User Creation', () => {
    it('should create a user with hashed password', async () => {
      const userData = {
        name: 'Model Test User',
        email: 'modeltest@example.com',
        password: 'testpassword123',
        phone: '05551111111',
        mahalle: 'Test Mahalle',
      };

      const user = await User.create(userData);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
      expect(user.password).not.toBe(userData.password); // Should be hashed
      expect(user.password.length).toBeGreaterThan(20); // Bcrypt hash is long
      expect(user.golbucks).toBe(0); // Default value
      expect(user.is_active).toBe(true); // Default value

      // Cleanup
      await User.destroy({ where: { id: user.id } });
    });

    it('should hash password on update', async () => {
      const user = await User.create({
        name: 'Update Test',
        email: 'updatetest@example.com',
        password: 'oldpassword123',
      });

      const oldPasswordHash = user.password;

      await user.update({ password: 'newpassword123' });
      await user.reload();

      expect(user.password).not.toBe(oldPasswordHash);
      expect(user.password).not.toBe('newpassword123');

      // Cleanup
      await User.destroy({ where: { id: user.id } });
    });
  });

  describe('Password Comparison', () => {
    it('should compare password correctly', async () => {
      const user = await User.create({
        name: 'Password Test',
        email: 'passwordtest@example.com',
        password: 'testpassword123',
      });

      const isValid = await user.comparePassword('testpassword123');
      expect(isValid).toBe(true);

      const isInvalid = await user.comparePassword('wrongpassword');
      expect(isInvalid).toBe(false);

      // Cleanup
      await User.destroy({ where: { id: user.id } });
    });
  });

  describe('toJSON Method', () => {
    it('should exclude password from JSON', async () => {
      const user = await User.create({
        name: 'JSON Test',
        email: 'jsontest@example.com',
        password: 'testpassword123',
      });

      const userJSON = user.toJSON();
      expect(userJSON).not.toHaveProperty('password');
      expect(userJSON).toHaveProperty('id');
      expect(userJSON).toHaveProperty('email');
      expect(userJSON).toHaveProperty('name');

      // Cleanup
      await User.destroy({ where: { id: user.id } });
    });
  });

  describe('Validation', () => {
    it('should fail with invalid email', async () => {
      await expect(
        User.create({
          name: 'Invalid Email',
          email: 'invalid-email',
          password: 'password123',
        })
      ).rejects.toThrow();
    });

    it('should fail with short password', async () => {
      await expect(
        User.create({
          name: 'Short Password',
          email: 'shortpass@example.com',
          password: '12345', // Too short
        })
      ).rejects.toThrow();
    });

    it('should fail with duplicate email', async () => {
      const email = 'duplicate@example.com';
      
      await User.create({
        name: 'First User',
        email: email,
        password: 'password123',
      });

      await expect(
        User.create({
          name: 'Second User',
          email: email,
          password: 'password123',
        })
      ).rejects.toThrow();

      // Cleanup
      await User.destroy({ where: { email } });
    });
  });
});

