const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Application = sequelize.define(
  'Application',
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
    type: {
      type: DataTypes.ENUM(
        'complaint', // Şikayet
        'request', // Talep
        'marriage', // Nikah başvurusu
        'muhtar_message', // Muhtara mesaj
        'other' // Diğer
      ),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.ENUM(
        'pending', // Beklemede
        'in_progress', // İşlemde
        'resolved', // Çözüldü
        'rejected', // Reddedildi
        'closed' // Kapandı
      ),
      defaultValue: 'pending',
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    admin_response: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    admin_response_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    user_comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user_comment_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reference_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
  },
  {
    tableName: 'applications',
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
        fields: ['status'],
      },
      {
        fields: ['reference_number'],
        unique: true,
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

// Associations
Application.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

User.hasMany(Application, {
  foreignKey: 'user_id',
  as: 'applications',
});

module.exports = Application;

