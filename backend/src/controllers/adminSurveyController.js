const { Survey, Question } = require('../models');
const { NotFoundError, ValidationError } = require('../utils/errors');
const { Op } = require('sequelize');

/**
 * Create survey (Admin)
 * POST /api/admin/surveys
 */
const createSurvey = async (req, res, next) => {
  try {
    const { title, description, status, golbucks_reward, expires_at, questions } = req.body;

    if (!title) {
      throw new ValidationError('Title is required');
    }

    const survey = await Survey.create({
      title,
      description: description || null,
      status: status || 'draft',
      golbucks_reward: golbucks_reward ? parseInt(golbucks_reward) : 0,
      expires_at: expires_at ? new Date(expires_at) : null,
      is_active: true,
    });

    // Create questions if provided
    if (questions && Array.isArray(questions)) {
      const questionPromises = questions.map((q, index) =>
        Question.create({
          survey_id: survey.id,
          text: q.text,
          type: q.type,
          options: q.options || null,
          is_required: q.is_required !== undefined ? q.is_required : true,
          order: q.order !== undefined ? q.order : index,
        })
      );
      await Promise.all(questionPromises);
    }

    // Reload with questions
    await survey.reload({
      include: [
        {
          model: Question,
          as: 'questions',
          order: [['order', 'ASC']],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Survey created successfully',
      data: { survey },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update survey (Admin)
 * PUT /api/admin/surveys/:id
 */
const updateSurvey = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const survey = await Survey.findByPk(id, {
      include: [
        {
          model: Question,
          as: 'questions',
        },
      ],
    });

    if (!survey) {
      throw new NotFoundError('Survey');
    }

    if (updateData.expires_at) {
      updateData.expires_at = new Date(updateData.expires_at);
    }

    if (updateData.golbucks_reward) {
      updateData.golbucks_reward = parseInt(updateData.golbucks_reward);
    }

    await survey.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Survey updated successfully',
      data: { survey },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all surveys (Admin)
 * GET /api/admin/surveys
 */
const getSurveys = async (req, res, next) => {
  try {
    const { search, status, limit, offset } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const surveys = await Survey.findAndCountAll({
      where,
      include: [
        {
          model: Question,
          as: 'questions',
          attributes: ['id', 'text', 'type', 'options', 'is_required', 'order'],
          order: [['order', 'ASC']],
          required: false,
        },
      ],
      order: [['created_at', 'DESC']],
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });

    res.status(200).json({
      success: true,
      data: {
        surveys: surveys.rows.map((s) => s.toJSON()),
        total: surveys.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete survey (Admin)
 * DELETE /api/admin/surveys/:id
 */
const deleteSurvey = async (req, res, next) => {
  try {
    const { id } = req.params;

    const survey = await Survey.findByPk(id);

    if (!survey) {
      throw new NotFoundError('Survey');
    }

    await survey.destroy();

    res.status(200).json({
      success: true,
      message: 'Survey deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add question to survey (Admin)
 * POST /api/admin/surveys/:id/questions
 */
const addQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, type, options, is_required, order } = req.body;

    const survey = await Survey.findByPk(id);

    if (!survey) {
      throw new NotFoundError('Survey');
    }

    // Get max order
    const maxOrder = await Question.max('order', {
      where: { survey_id: id },
    });

    const question = await Question.create({
      survey_id: id,
      text,
      type,
      options: options || null,
      is_required: is_required !== undefined ? is_required : true,
      order: order !== undefined ? order : (maxOrder || 0) + 1,
    });

    res.status(201).json({
      success: true,
      message: 'Question added successfully',
      data: { question },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update question (Admin)
 * PUT /api/admin/questions/:id
 */
const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const question = await Question.findByPk(id);

    if (!question) {
      throw new NotFoundError('Question');
    }

    await question.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: { question },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete question (Admin)
 * DELETE /api/admin/questions/:id
 */
const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const question = await Question.findByPk(id);

    if (!question) {
      throw new NotFoundError('Question');
    }

    await question.destroy();

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSurveys,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  addQuestion,
  updateQuestion,
  deleteQuestion,
};

