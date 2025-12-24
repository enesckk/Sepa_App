const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const BillSupport = sequelize.define(
  'BillSupport',
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
    bill_type: {
      type: DataTypes.ENUM(
        'electricity', // Elektrik
        'water', // Su
        'gas', // Doğalgaz
        'internet', // İnternet
        'phone', // Telefon
        'other' // Diğer
      ),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        'pending', // Beklemede
        'approved', // Onaylandı
        'rejected', // Reddedildi
        'paid', // Ödendi
        'cancelled' // İptal edildi
      ),
      defaultValue: 'pending',
      allowNull: false,
    },
    admin_response: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    admin_response_date: {
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
    tableName: 'bill_supports',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['bill_type'],
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
BillSupport.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

User.hasMany(BillSupport, {
  foreignKey: 'user_id',
  as: 'billSupports',
});

module.exports = BillSupport;

