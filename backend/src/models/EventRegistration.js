const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EventRegistration = sequelize.define(
  'EventRegistration',
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
    event_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id',
      },
    },
    qr_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    reference_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('registered', 'cancelled', 'attended', 'no_show'),
      defaultValue: 'registered',
      allowNull: false,
    },
    checked_in_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Kişisel bilgiler (etkinlik başvurusu için)
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Başvuru sahibinin adı',
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Başvuru sahibinin soyadı',
    },
    tc_no: {
      type: DataTypes.STRING(11),
      allowNull: true,
      comment: 'TC Kimlik Numarası',
      validate: {
        len: [11, 11],
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Telefon numarası',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'E-posta adresi',
      validate: {
        isEmail: true,
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Ek notlar veya özel istekler',
    },
  },
  {
    tableName: 'event_registrations',
    timestamps: true,
    createdAt: 'registration_date',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['event_id'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['qr_code'],
        unique: true,
      },
      {
        fields: ['reference_code'],
        unique: true,
      },
      {
        fields: ['user_id', 'event_id'],
        unique: true, // Bir kullanıcı aynı etkinliğe sadece bir kez kayıt olabilir
      },
    ],
  }
);

// Associations will be set up in models/index.js to avoid circular dependencies

module.exports = EventRegistration;

