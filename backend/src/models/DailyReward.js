const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DailyReward = sequelize.define(
  'DailyReward',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    last_reward_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    current_streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    longest_streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    total_rewards: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  {
    tableName: 'daily_rewards',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['user_id'],
        unique: true,
      },
      {
        fields: ['last_reward_date'],
      },
    ],
  }
);

// Associations will be set up in models/index.js to avoid circular dependencies

module.exports = DailyReward;

