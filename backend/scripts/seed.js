/**
 * Seed script to populate database with initial data
 * Run with: node scripts/seed.js
 */

require('dotenv').config();
const { sequelize } = require('../src/config/database');
const { seedRewards } = require('../src/services/seedRewards');
const { seedSurveys } = require('../src/services/seedSurveys');
const seedEvents = require('../src/services/seedEvents');
const { seedNews } = require('../src/services/seedNews');

async function runSeeds() {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    console.log('\n🌱 Starting seed process...\n');

    // Seed news
    console.log('📰 Seeding news...');
    await seedNews();
    
    // Seed events
    console.log('\n🎉 Seeding events...');
    await seedEvents();

    // Seed rewards
    console.log('\n📦 Seeding rewards...');
    await seedRewards();
    
    // Seed surveys
    console.log('\n📋 Seeding surveys...');
    await seedSurveys();

    console.log('\n✅ All seeds completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    process.exit(1);
  }
}

runSeeds();

