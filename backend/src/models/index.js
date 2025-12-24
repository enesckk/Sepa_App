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
const BillSupportTransaction = require('./BillSupportTransaction');
const Story = require('./Story');
const StoryView = require('./StoryView');
const Survey = require('./Survey');
const Question = require('./Question');
const Answer = require('./Answer');
const News = require('./News');
const Place = require('./Place');
const EmergencyGathering = require('./EmergencyGathering');
const Notification = require('./Notification');

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
  BillSupportTransaction,
  Story,
  StoryView,
  Survey,
  Question,
  Answer,
  News,
  Place,
  EmergencyGathering,
  Notification,
  sequelize,
};

// Set up associations after all models are loaded
// Note: Most associations are already defined in their respective model files
// Only define associations here that are NOT in model files

// Notification associations (not defined in Notification.js)
Notification.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});
User.hasMany(Notification, {
  foreignKey: 'user_id',
  as: 'notifications',
});

// BillSupportTransaction associations (not defined in BillSupportTransaction.js)
BillSupportTransaction.belongsTo(User, {
  foreignKey: 'supporter_id',
  as: 'supporter',
});
User.hasMany(BillSupportTransaction, {
  foreignKey: 'supporter_id',
  as: 'supportedBills',
});

BillSupportTransaction.belongsTo(BillSupport, {
  foreignKey: 'bill_support_id',
  as: 'billSupport',
});
BillSupport.hasMany(BillSupportTransaction, {
  foreignKey: 'bill_support_id',
  as: 'transactions',
});

// Survey associations (Question and Survey don't define associations in their files)
Question.belongsTo(Survey, {
  foreignKey: 'survey_id',
  as: 'survey',
});
Survey.hasMany(Question, {
  foreignKey: 'survey_id',
  as: 'questions',
});

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

