const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define(
  'Notification',
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
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    type: {
      type: DataTypes.ENUM(
        'info', // Bilgilendirme
        'success', // Başarı
        'warning', // Uyarı
        'error', // Hata
        'event', // Etkinlik
        'reward', // Ödül
        'application', // Başvuru
        'system' // Sistem
      ),
      allowNull: false,
      defaultValue: 'info',
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Additional data (e.g., event_id, reward_id, etc.)',
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    action_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL to navigate when notification is clicked',
    },
  },
  {
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['is_read'],
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

module.exports = Notification;

