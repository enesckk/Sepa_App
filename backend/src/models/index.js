const { sequelize } = require('../config/database');
const User = require('./User');
const GolbucksTransaction = require('./GolbucksTransaction');
const DailyReward = require('./DailyReward');
const Reward = require('./Reward');
const UserReward = require('./UserReward');
const Event = require('./Event');
const EventRegistration = require('./EventRegistration');
const Application = require('./Application');
const BillSupport = require('./BillSupport');
const Story = require('./Story');
const StoryView = require('./StoryView');
const Survey = require('./Survey');
const Question = require('./Question');
const Answer = require('./Answer');

// Initialize all models
const models = {
  User,
  GolbucksTransaction,
  DailyReward,
  Reward,
  UserReward,
  Event,
  EventRegistration,
  Application,
  BillSupport,
  Story,
  StoryView,
  Survey,
  Question,
  Answer,
  sequelize,
};

// Sync models with database (only in development)
const syncModels = async (force = false) => {
  try {
    await sequelize.sync({ alter: true }); // Use alter instead of force
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Models synchronized with database');
    }
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

