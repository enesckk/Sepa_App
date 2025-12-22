const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reward = sequelize.define(
  'Reward',
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
    category: {
      type: DataTypes.ENUM(
        'partner',
        'digital',
        'physical',
        'experience',
        'discount',
        'other'
      ),
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    validity_days: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
    },
    partner_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    qr_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    reference_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: 'rewards',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['category'],
      },
      {
        fields: ['points'],
      },
      {
        fields: ['is_active'],
      },
    ],
  }
);

module.exports = Reward;

