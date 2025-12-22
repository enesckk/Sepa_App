const {
  getNews,
  getNewsById,
  getNewsCategories,
} = require('../services/newsService');

/**
 * Get all news
 * GET /api/news
 */
const getNewsEndpoint = async (req, res, next) => {
  try {
    const filters = {
      category: req.query.category,
      search: req.query.search,
      limit: req.query.limit,
      offset: req.query.offset,
      sort: req.query.sort,
      order: req.query.order,
    };

    const result = await getNews(filters);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get news by ID
 * GET /api/news/:id
 */
const getNewsByIdEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;

    const news = await getNewsById(id);

    res.status(200).json({
      success: true,
      data: {
        news,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get news categories
 * GET /api/news/categories
 */
const getNewsCategoriesEndpoint = async (req, res, next) => {
  try {
    const categories = await getNewsCategories();

    res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNews: getNewsEndpoint,
  getNewsById: getNewsByIdEndpoint,
  getNewsCategories: getNewsCategoriesEndpoint,
};

