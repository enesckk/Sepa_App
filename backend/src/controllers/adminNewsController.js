const { News } = require('../models');
const { NotFoundError } = require('../utils/errors');
const path = require('path');
const pushNotificationService = require('../services/pushNotificationService');

/**
 * Create news (Admin)
 * POST /api/admin/news
 */
const createNews = async (req, res, next) => {
  try {
    const { title, content, summary, category, author, published_at } = req.body;

    let image_url = null;
    if (req.file) {
      image_url = `/uploads/news/${req.file.filename}`;
    } else if (req.body.image_url) {
      image_url = req.body.image_url;
    }

    const news = await News.create({
      title,
      content,
      summary: summary || null,
      category: category || 'haber',
      author: author || null,
      published_at: published_at ? new Date(published_at) : new Date(),
      image_url,
      is_active: true,
      view_count: 0,
    });

    // Send push notification to all users about new news
    try {
      await pushNotificationService.sendToAllUsers(
        {
          title: 'Yeni Haber! 📰',
          body: news.title,
        },
        {
          type: 'news',
          news_id: news.id,
          action_url: `/news/${news.id}`,
        }
      );
    } catch (error) {
      console.error('Push notification error for new news:', error.message);
    }

    res.status(201).json({
      success: true,
      message: 'News created successfully',
      data: { news },
    });
  } catch (error) {
    if (req.file) {
      const fs = require('fs');
      const filePath = path.join(__dirname, '../../uploads/news', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

/**
 * Update news (Admin)
 * PUT /api/admin/news/:id
 */
const updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const news = await News.findByPk(id);

    if (!news) {
      throw new NotFoundError('News');
    }

    if (req.file) {
      updateData.image_url = `/uploads/news/${req.file.filename}`;
    }

    if (updateData.published_at) {
      updateData.published_at = new Date(updateData.published_at);
    }

    await news.update(updateData);

    res.status(200).json({
      success: true,
      message: 'News updated successfully',
      data: { news },
    });
  } catch (error) {
    if (req.file) {
      const fs = require('fs');
      const filePath = path.join(__dirname, '../../uploads/news', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

/**
 * Delete news (Admin)
 * DELETE /api/admin/news/:id
 */
const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const news = await News.findByPk(id);

    if (!news) {
      throw new NotFoundError('News');
    }

    await news.destroy();

    res.status(200).json({
      success: true,
      message: 'News deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNews,
  updateNews,
  deleteNews,
};

