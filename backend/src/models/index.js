const { sequelize } = require('../config/database');
const User = require('./User');
const GolbucksTransaction = require('./GolbucksTransaction');
const DailyReward = require('./DailyReward');
const Reward = require('./Reward');
const UserReward = require('./UserReward');

// Initialize all models
const models = {
  User,
  GolbucksTransaction,
  DailyReward,
  Reward,
  UserReward,
  sequelize,
};

// Sync models with database (only in development)
const syncModels = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Models synchronized with database');
    return true;
  } catch (error) {
    console.error('❌ Error syncing models:', error.message);
    return false;
  }
};

module.exports = {
  ...models,
  syncModels,
};

