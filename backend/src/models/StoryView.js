const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { User } = require('./User');
const Story = require('./Story');

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

// Associations
StoryView.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

StoryView.belongsTo(Story, {
  foreignKey: 'story_id',
  as: 'story',
});

User.hasMany(StoryView, {
  foreignKey: 'user_id',
  as: 'storyViews',
});

Story.hasMany(StoryView, {
  foreignKey: 'story_id',
  as: 'views',
});

module.exports = StoryView;

