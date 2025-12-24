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
  EmergencyGathering,
  Notification,
  sequelize,
};

// Set up associations after all models are loaded
// User associations
GolbucksTransaction.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});
User.hasMany(GolbucksTransaction, {
  foreignKey: 'user_id',
  as: 'transactions',
});

DailyReward.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});
User.hasOne(DailyReward, {
  foreignKey: 'user_id',
  as: 'dailyReward',
});

Application.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});
User.hasMany(Application, {
  foreignKey: 'user_id',
  as: 'applications',
});

BillSupport.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});
User.hasMany(BillSupport, {
  foreignKey: 'user_id',
  as: 'billSupports',
});

BillSupportTransaction.belongsTo(User, {
  foreignKey: 'supporter_id',
  as: 'supporter',
});
User.hasMany(BillSupportTransaction, {
  foreignKey: 'supporter_id',
  as: 'supportedBills',
});

EventRegistration.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});
User.hasMany(EventRegistration, {
  foreignKey: 'user_id',
  as: 'eventRegistrations',
});

Answer.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});
User.hasMany(Answer, {
  foreignKey: 'user_id',
  as: 'answers',
});

// BillSupport associations
BillSupportTransaction.belongsTo(BillSupport, {
  foreignKey: 'bill_support_id',
  as: 'billSupport',
});
BillSupport.hasMany(BillSupportTransaction, {
  foreignKey: 'bill_support_id',
  as: 'transactions',
});

// Event associations
EventRegistration.belongsTo(Event, {
  foreignKey: 'event_id',
  as: 'event',
});
Event.hasMany(EventRegistration, {
  foreignKey: 'event_id',
  as: 'registrations',
});

// Survey associations
Question.belongsTo(Survey, {
  foreignKey: 'survey_id',
  as: 'survey',
});
Survey.hasMany(Question, {
  foreignKey: 'survey_id',
  as: 'questions',
});

Answer.belongsTo(Question, {
  foreignKey: 'question_id',
  as: 'question',
});
Question.hasMany(Answer, {
  foreignKey: 'question_id',
  as: 'answers',
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

