const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Place = sequelize.define(
  'Place',
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
    type: {
      type: DataTypes.ENUM(
        'mosque', // Cami
        'pharmacy', // Eczane
        'facility', // Tesis
        'wedding', // Nikah salonu
        'park', // Park
        'library', // Kütüphane
        'sports', // Spor tesisi
        'cultural', // Kültür merkezi
        'health', // Sağlık tesisi
        'education', // Eğitim tesisi
        'other' // Diğer
      ),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Additional category for sub-classification',
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
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    working_hours: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Working hours as string (e.g., "09:00-18:00")',
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING(500)),
      allowNull: true,
      defaultValue: [],
      comment: 'Array of image URLs',
    },
    features: {
      type: DataTypes.ARRAY(DataTypes.STRING(100)),
      allowNull: true,
      defaultValue: [],
      comment: 'Array of features (e.g., ["WiFi", "Parking", "Accessible"])',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: 'places',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['type'],
      },
      {
        fields: ['category'],
      },
      {
        fields: ['is_active'],
      },
      {
        fields: ['latitude', 'longitude'],
      },
      {
        fields: ['name'],
      },
    ],
  }
);

module.exports = Place;

