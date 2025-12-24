const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * BillSupportTransaction Model
 * Tracks which users supported which bills and how much they contributed
 */
const BillSupportTransaction = sequelize.define(
  'BillSupportTransaction',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bill_support_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'bill_supports',
        key: 'id',
      },
    },
    supporter_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'User who is supporting the bill',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01,
      },
      comment: 'Amount contributed by supporter',
    },
    payment_method: {
      type: DataTypes.ENUM('golbucks', 'direct', 'other'),
      defaultValue: 'direct',
      allowNull: false,
      comment: 'How the supporter paid',
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending',
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Optional notes from supporter',
    },
  },
  {
    tableName: 'bill_support_transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['bill_support_id'],
      },
      {
        fields: ['supporter_id'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['bill_support_id', 'supporter_id'],
        unique: true,
        name: 'unique_bill_supporter',
        comment: 'A user can only support a bill once',
      },
    ],
  }
);

// Associations will be set up in models/index.js to avoid circular dependencies

module.exports = BillSupportTransaction;

