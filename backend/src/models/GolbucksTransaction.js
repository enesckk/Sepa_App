const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const GolbucksTransaction = sequelize.define(
  'GolbucksTransaction',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notZero: true,
      },
    },
    type: {
      type: DataTypes.ENUM(
        'daily_reward',
        'streak_bonus',
        'event_registration',
        'survey_completion',
        'reward_purchase',
        'reward_refund',
        'admin_adjustment',
        'other'
      ),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    balance_after: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  },
  {
    tableName: 'golbucks_transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['type'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

// Associations
GolbucksTransaction.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

User.hasMany(GolbucksTransaction, {
  foreignKey: 'user_id',
  as: 'transactions',
});

module.exports = GolbucksTransaction;

