const {
  getActiveStories,
  getStoryById,
  recordStoryView,
  createStory,
  updateStory,
  deleteStory,
} = require('../services/storyService');
const path = require('path');

/**
 * Get all active stories
 * GET /api/stories
 */
const getStories = async (req, res, next) => {
  try {
    const userId = req.userId || null; // Optional: to check if viewed

    const stories = await getActiveStories(userId);

    res.status(200).json({
      success: true,
      data: {
        stories,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get story by ID
 * GET /api/stories/:id
 */
const getStoryByIdEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;

    const story = await getStoryById(id);

    res.status(200).json({
      success: true,
      data: {
        story,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Record story view
 * POST /api/stories/:id/view
 */
const viewStory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const view = await recordStoryView(userId, id);

    res.status(200).json({
      success: true,
      message: 'Story view recorded',
      data: {
        view,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create story (Admin only)
 * POST /api/stories
 */
const createStoryEndpoint = async (req, res, next) => {
  try {
    const { title, description, expires_at, order } = req.body;

    // Get uploaded file path if exists
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/stories/${req.file.filename}`;
    } else if (req.body.image_url) {
      // Allow direct URL if no file uploaded
      image_url = req.body.image_url;
    } else {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Image is required (either file upload or image_url)',
      });
    }

    const storyData = {
      title,
      description,
      image_url,
      expires_at,
      order,
    };

    const story = await createStory(storyData);

    res.status(201).json({
      success: true,
      message: 'Story created successfully',
      data: {
        story,
      },
    });
  } catch (error) {
    // Delete uploaded file if story creation failed
    if (req.file) {
      const fs = require('fs');
      const filePath = path.join(__dirname, '../../uploads/stories', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

/**
 * Update story (Admin only)
 * PUT /api/stories/:id
 */
const updateStoryEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, expires_at, order, is_active } = req.body;

    // Get uploaded file path if exists
    let image_url = undefined;
    if (req.file) {
      image_url = `/uploads/stories/${req.file.filename}`;
    } else if (req.body.image_url !== undefined) {
      image_url = req.body.image_url;
    }

    const storyData = {
      title,
      description,
      image_url,
      expires_at,
      order,
      is_active,
    };

    // Remove undefined values
    Object.keys(storyData).forEach((key) => {
      if (storyData[key] === undefined) {
        delete storyData[key];
      }
    });

    const story = await updateStory(id, storyData);

    res.status(200).json({
      success: true,
      message: 'Story updated successfully',
      data: {
        story,
      },
    });
  } catch (error) {
    // Delete uploaded file if story update failed
    if (req.file) {
      const fs = require('fs');
      const filePath = path.join(__dirname, '../../uploads/stories', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

/**
 * Delete story (Admin only)
 * DELETE /api/stories/:id
 */
const deleteStoryEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;

    await deleteStory(id);

    res.status(200).json({
      success: true,
      message: 'Story deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStories,
  getStoryById: getStoryByIdEndpoint,
  viewStory,
  createStory: createStoryEndpoint,
  updateStory: updateStoryEndpoint,
  deleteStory: deleteStoryEndpoint,
};

