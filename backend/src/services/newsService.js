const { News } = require('../models');
const { NotFoundError } = require('../utils/errors');
const { Op } = require('sequelize');

/**
 * Get all news with filters
 * @param {object} filters - Filter options
 * @returns {Promise<Object>} News list
 */
const getNews = async (filters = {}) => {
  const {
    category,
    search,
    limit = 50,
    offset = 0,
    sort = 'published_at',
    order = 'DESC',
  } = filters;

  const where = {
    is_active: true,
  };

  // Category filter
  if (category) {
    where.category = category;
  }

  // Search filter
  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { content: { [Op.iLike]: `%${search}%` } },
      { summary: { [Op.iLike]: `%${search}%` } },
    ];
  }

  // Sort options
  const validSortFields = ['published_at', 'created_at', 'title', 'view_count'];
  const sortField = validSortFields.includes(sort) ? sort : 'published_at';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const news = await News.findAndCountAll({
    where,
    order: [[sortField, sortOrder]],
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  return {
    news: news.rows.map((item) => item.toJSON()),
    total: news.count,
    limit: parseInt(limit),
    offset: parseInt(offset),
  };
};

/**
 * Get news by ID
 * @param {string} newsId - News ID
 * @returns {Promise<Object>} News
 */
const getNewsById = async (newsId) => {
  const news = await News.findByPk(newsId);

  if (!news || !news.is_active) {
    throw new NotFoundError('News');
  }

  // Increment view count
  await news.increment('view_count');

  return news.toJSON();
};

/**
 * Get news categories
 * @returns {Promise<Array>} List of categories with counts
 */
const getNewsCategories = async () => {
  const { sequelize } = require('../models');

  const categories = await News.findAll({
    attributes: [
      [sequelize.fn('DISTINCT', sequelize.col('category')), 'category'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    where: {
      is_active: true,
    },
    group: ['category'],
    raw: true,
  });

  return categories.map((cat) => ({
    category: cat.category,
    count: parseInt(cat.count),
  }));
};

module.exports = {
  getNews,
  getNewsById,
  getNewsCategories,
};

