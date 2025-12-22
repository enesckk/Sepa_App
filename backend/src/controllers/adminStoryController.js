const { Story } = require('../models');
const { createStory, updateStory, deleteStory } = require('../services/storyService');
const { NotFoundError } = require('../utils/errors');
const path = require('path');

/**
 * Create story (Admin)
 * POST /api/admin/stories
 */
const createStoryAdmin = async (req, res, next) => {
  try {
    const { title, description, expires_at, order } = req.body;

    let image_url = null;
    if (req.file) {
      image_url = `/uploads/stories/${req.file.filename}`;
    } else if (req.body.image_url) {
      image_url = req.body.image_url;
    } else {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Image is required',
      });
    }

    const story = await createStory({
      title,
      description,
      image_url,
      expires_at,
      order,
    });

    res.status(201).json({
      success: true,
      message: 'Story created successfully',
      data: { story },
    });
  } catch (error) {
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
 * Update story (Admin)
 * PUT /api/admin/stories/:id
 */
const updateStoryAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      updateData.image_url = `/uploads/stories/${req.file.filename}`;
    }

    const story = await updateStory(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Story updated successfully',
      data: { story },
    });
  } catch (error) {
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
 * Delete story (Admin)
 * DELETE /api/admin/stories/:id
 */
const deleteStoryAdmin = async (req, res, next) => {
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
  createStory: createStoryAdmin,
  updateStory: updateStoryAdmin,
  deleteStory: deleteStoryAdmin,
};

