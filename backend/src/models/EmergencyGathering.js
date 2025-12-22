const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EmergencyGathering = sequelize.define(
  'EmergencyGathering',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
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
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
      validate: {
        min: -90,
        max: 90,
      },
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
      validate: {
        min: -180,
        max: 180,
      },
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Maximum capacity (number of people)',
    },
    type: {
      type: DataTypes.ENUM(
        'open_area', // Açık alan
        'building', // Bina
        'stadium', // Stadyum
        'park', // Park
        'school', // Okul
        'other' // Diğer
      ),
      allowNull: false,
      defaultValue: 'open_area',
    },
    facilities: {
      type: DataTypes.ARRAY(DataTypes.STRING(100)),
      allowNull: true,
      defaultValue: [],
      comment: 'Array of facilities (e.g., ["Water", "Toilet", "First Aid"])',
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: 'emergency_gathering_areas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['type'],
      },
      {
        fields: ['is_active'],
      },
      {
        fields: ['latitude', 'longitude'],
      },
    ],
  }
);

module.exports = EmergencyGathering;

