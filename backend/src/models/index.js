const { sequelize } = require('../config/database');
const User = require('./User');

// Initialize all models
const models = {
  User,
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

