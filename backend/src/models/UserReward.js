const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserReward = sequelize.define(
  'UserReward',
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
    reward_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'rewards',
        key: 'id',
      },
    },
    qr_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    reference_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    redeemed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: 'user_rewards',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['reward_id'],
      },
      {
        fields: ['is_used'],
      },
    ],
  }
);

// Associations will be set up in models/index.js to avoid circular dependencies

module.exports = UserReward;

