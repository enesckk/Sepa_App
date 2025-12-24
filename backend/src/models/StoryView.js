const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const StoryView = sequelize.define(
  'StoryView',
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
    story_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'stories',
        key: 'id',
      },
    },
    viewed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: 'story_views',
    timestamps: false, // We use viewed_at instead
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['story_id'],
      },
      {
        fields: ['viewed_at'],
      },
      {
        fields: ['user_id', 'story_id'],
        unique: true, // A user can only view a story once (or we can track multiple views)
      },
    ],
  }
);

// Associations will be set up in models/index.js to avoid circular dependencies

module.exports = StoryView;

