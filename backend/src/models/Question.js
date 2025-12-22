const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Survey = require('./Survey');

const Question = sequelize.define(
  'Question',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    survey_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'surveys',
        key: 'id',
      },
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    type: {
      type: DataTypes.ENUM(
        'single_choice', // Tek seçim (radio)
        'multiple_choice', // Çoklu seçim (checkbox)
        'text', // Metin cevabı
        'number', // Sayı cevabı
        'rating', // Değerlendirme (1-5)
        'yes_no' // Evet/Hayır
      ),
      allowNull: false,
    },
    options: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Array of options for choice questions (e.g., ["Option 1", "Option 2"])',
    },
    is_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: 'Display order (lower numbers appear first)',
    },
  },
  {
    tableName: 'questions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['survey_id'],
      },
      {
        fields: ['order'],
      },
    ],
  }
);

// Associations
Question.belongsTo(Survey, {
  foreignKey: 'survey_id',
  as: 'survey',
});

Survey.hasMany(Question, {
  foreignKey: 'survey_id',
  as: 'questions',
});

module.exports = Question;

