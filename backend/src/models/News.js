const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const News = sequelize.define(
  'News',
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    summary: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Short summary for list views',
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM(
        'haber', // Haber
        'duyuru', // Duyuru
        'etkinlik', // Etkinlik
        'proje', // Proje
        'basin', // Basın
        'other' // Diğer
      ),
      allowNull: false,
      defaultValue: 'haber',
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Publication date. If null, uses created_at',
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
    author: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Author name',
    },
  },
  {
    tableName: 'news',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['category'],
      },
      {
        fields: ['is_active'],
      },
      {
        fields: ['published_at'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

module.exports = News;

