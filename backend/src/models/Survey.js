const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Survey = sequelize.define(
  'Survey',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'active', 'closed', 'archived'),
      defaultValue: 'draft',
      allowNull: false,
    },
    golbucks_reward: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Survey expiration date. If null, survey never expires.',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: 'surveys',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['status'],
      },
      {
        fields: ['is_active'],
      },
      {
        fields: ['expires_at'],
      },
    ],
  }
);

module.exports = Survey;

