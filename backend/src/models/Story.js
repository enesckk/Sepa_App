const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Story = sequelize.define(
  'Story',
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
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Story expiration date. If null, story never expires.',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: 'Display order (lower numbers appear first)',
    },
  },
  {
    tableName: 'stories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['is_active'],
      },
      {
        fields: ['expires_at'],
      },
      {
        fields: ['order'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

module.exports = Story;

