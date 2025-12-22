const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { User } = require('./User');
const Question = require('./Question');

const Answer = sequelize.define(
  'Answer',
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
    question_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'questions',
        key: 'id',
      },
    },
    answer_text: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Text answer for text/number/rating questions',
    },
    answer_options: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Array of selected options for choice questions',
    },
  },
  {
    tableName: 'answers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['question_id'],
      },
      {
        fields: ['user_id', 'question_id'],
        unique: true, // A user can only answer a question once
      },
    ],
  }
);

// Associations
Answer.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

Answer.belongsTo(Question, {
  foreignKey: 'question_id',
  as: 'question',
});

User.hasMany(Answer, {
  foreignKey: 'user_id',
  as: 'answers',
});

Question.hasMany(Answer, {
  foreignKey: 'question_id',
  as: 'answers',
});

module.exports = Answer;

