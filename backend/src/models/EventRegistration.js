const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { User } = require('./User');
const Event = require('./Event');

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

// Associations
EventRegistration.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

EventRegistration.belongsTo(Event, {
  foreignKey: 'event_id',
  as: 'event',
});

User.hasMany(EventRegistration, {
  foreignKey: 'user_id',
  as: 'eventRegistrations',
});

Event.hasMany(EventRegistration, {
  foreignKey: 'event_id',
  as: 'registrations',
});

module.exports = EventRegistration;

