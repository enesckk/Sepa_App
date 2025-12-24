const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Reward = require('./Reward');

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

// Associations
UserReward.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

UserReward.belongsTo(Reward, {
  foreignKey: 'reward_id',
  as: 'reward',
});

User.hasMany(UserReward, {
  foreignKey: 'user_id',
  as: 'userRewards',
});

Reward.hasMany(UserReward, {
  foreignKey: 'reward_id',
  as: 'userRewards',
});

module.exports = UserReward;

