const { Story, StoryView } = require('../models');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { Op } = require('sequelize');

/**
 * Get all active stories
 * @param {string} userId - User ID (optional, to check if viewed)
 * @returns {Promise<Array>} Active stories
 */
const getActiveStories = async (userId = null) => {
  const now = new Date();

  const where = {
    is_active: true,
    [Op.or]: [
      { expires_at: null }, // Never expires
      { expires_at: { [Op.gt]: now } }, // Not expired yet
    ],
  };

  const stories = await Story.findAll({
    where,
    order: [['order', 'ASC'], ['created_at', 'DESC']],
  });

  // If userId provided, check which stories are viewed
  if (userId) {
    const viewedStoryIds = await StoryView.findAll({
      where: {
        user_id: userId,
        story_id: {
          [Op.in]: stories.map((s) => s.id),
        },
      },
      attributes: ['story_id'],
    });

    const viewedIds = new Set(viewedStoryIds.map((v) => v.story_id.toString()));

    // Add isViewed property to each story
    return stories.map((story) => ({
      ...story.toJSON(),
      isViewed: viewedIds.has(story.id.toString()),
    }));
  }

  return stories;
};

/**
 * Get story by ID
 * @param {string} storyId - Story ID
 * @returns {Promise<Object>} Story
 */
const getStoryById = async (storyId) => {
  const story = await Story.findByPk(storyId);

  if (!story || !story.is_active) {
    throw new NotFoundError('Story');
  }

  // Check if expired
  if (story.expires_at && new Date(story.expires_at) < new Date()) {
    throw new NotFoundError('Story');
  }

  return story;
};

/**
 * Record story view
 * @param {string} userId - User ID
 * @param {string} storyId - Story ID
 * @returns {Promise<Object>} View record
 */
const recordStoryView = async (userId, storyId) => {
  // Check if story exists and is active
  const story = await getStoryById(storyId);

  // Check if user already viewed this story
  const existingView = await StoryView.findOne({
    where: {
      user_id: userId,
      story_id: storyId,
    },
  });

  if (existingView) {
    // Update viewed_at timestamp
    await existingView.update({
      viewed_at: new Date(),
    });
    return existingView;
  }

  // Create new view record
  const view = await StoryView.create({
    user_id: userId,
    story_id: storyId,
    viewed_at: new Date(),
  });

  // Increment story view count
  await story.increment('view_count');

  return view;
};

/**
 * Create story (Admin only - will be used in admin routes)
 * @param {object} storyData - Story data
 * @returns {Promise<Object>} Created story
 */
const createStory = async (storyData) => {
  const { title, description, image_url, expires_at, order } = storyData;

  if (!title || !image_url) {
    throw new ValidationError('Title and image_url are required');
  }

  const story = await Story.create({
    title,
    description: description || null,
    image_url,
    expires_at: expires_at ? new Date(expires_at) : null,
    order: order || 0,
    is_active: true,
    view_count: 0,
  });

  return story;
};

/**
 * Update story (Admin only)
 * @param {string} storyId - Story ID
 * @param {object} storyData - Updated story data
 * @returns {Promise<Object>} Updated story
 */
const updateStory = async (storyId, storyData) => {
  const story = await Story.findByPk(storyId);

  if (!story) {
    throw new NotFoundError('Story');
  }

  const { title, description, image_url, expires_at, order, is_active } = storyData;

  if (title !== undefined) story.title = title;
  if (description !== undefined) story.description = description;
  if (image_url !== undefined) story.image_url = image_url;
  if (expires_at !== undefined) story.expires_at = expires_at ? new Date(expires_at) : null;
  if (order !== undefined) story.order = order;
  if (is_active !== undefined) story.is_active = is_active;

  await story.save();

  return story;
};

/**
 * Delete story (Admin only)
 * @param {string} storyId - Story ID
 * @returns {Promise<boolean>} Success
 */
const deleteStory = async (storyId) => {
  const story = await Story.findByPk(storyId);

  if (!story) {
    throw new NotFoundError('Story');
  }

  await story.destroy();

  return true;
};

module.exports = {
  getActiveStories,
  getStoryById,
  recordStoryView,
  createStory,
  updateStory,
  deleteStory,
};

