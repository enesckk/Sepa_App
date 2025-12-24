const { Survey, Question, Answer } = require('../models');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { Op } = require('sequelize');
const { addGolbucks } = require('./golbucksService');
const { sequelize } = require('../config/database');

/**
 * Get all active surveys
 * @param {string} userId - User ID (optional, to check if completed)
 * @returns {Promise<Array>} Active surveys
 */
const getActiveSurveys = async (userId = null) => {
  const now = new Date();

  const where = {
    status: 'active',
    is_active: true,
    [Op.or]: [
      { expires_at: null }, // Never expires
      { expires_at: { [Op.gt]: now } }, // Not expired yet
    ],
  };

  const surveys = await Survey.findAll({
    where,
    include: [
      {
        model: Question,
        as: 'questions',
        attributes: ['id', 'text', 'type', 'options', 'is_required', 'order'],
        required: false,
        separate: true,
        order: [['order', 'ASC']],
      },
    ],
    order: [['created_at', 'DESC']],
  });

  // If userId provided, check which surveys are completed
  if (userId) {
    const completedSurveyIds = await Answer.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('question.survey_id')), 'survey_id'],
      ],
      include: [
        {
          model: Question,
          as: 'question',
          attributes: [],
        },
      ],
      where: {
        user_id: userId,
      },
      raw: true,
    });

    const completedIds = new Set(
      completedSurveyIds.map((a) => a.survey_id?.toString()).filter(Boolean)
    );

    // Check if user completed all questions for each survey
    const surveysWithCompletion = await Promise.all(
      surveys.map(async (survey) => {
        const userAnswers = await Answer.count({
          where: {
            user_id: userId,
            question_id: {
              [Op.in]: survey.questions.map((q) => q.id),
            },
          },
        });

        const isCompleted = survey.questions.length > 0 && userAnswers === survey.questions.length;

        return {
          ...survey.toJSON(),
          isCompleted,
        };
      })
    );

    return surveysWithCompletion;
  }

  return surveys.map((survey) => survey.toJSON());
};

/**
 * Get survey by ID with questions
 * @param {string} surveyId - Survey ID
 * @param {string} userId - User ID (optional, to check if completed)
 * @returns {Promise<Object>} Survey with questions
 */
const getSurveyById = async (surveyId, userId = null) => {
  const survey = await Survey.findByPk(surveyId, {
    include: [
      {
        model: Question,
        as: 'questions',
        required: false,
        separate: true,
        order: [['order', 'ASC']],
      },
    ],
  });

  if (!survey || !survey.is_active || survey.status !== 'active') {
    throw new NotFoundError('Survey');
  }

  // Check if expired
  if (survey.expires_at && new Date(survey.expires_at) < new Date()) {
    throw new NotFoundError('Survey');
  }

  let surveyData = survey.toJSON();

  // Check if user completed this survey
  if (userId) {
    const userAnswers = await Answer.count({
      where: {
        user_id: userId,
        question_id: {
          [Op.in]: survey.questions.map((q) => q.id),
        },
      },
    });

    surveyData.isCompleted = survey.questions.length > 0 && userAnswers === survey.questions.length;
  }

  return surveyData;
};

/**
 * Submit survey answers
 * @param {string} userId - User ID
 * @param {string} surveyId - Survey ID
 * @param {Array} answers - Array of answers
 * @returns {Promise<Object>} Submission result
 */
const submitSurveyAnswers = async (userId, surveyId, answers) => {
  const transaction = await sequelize.transaction();

  try {
    // Get survey with questions
    const survey = await Survey.findByPk(surveyId, {
      include: [
        {
          model: Question,
          as: 'questions',
          separate: true,
          order: [['order', 'ASC']],
        },
      ],
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!survey || !survey.is_active || survey.status !== 'active') {
      throw new NotFoundError('Survey');
    }

    // Check if expired
    if (survey.expires_at && new Date(survey.expires_at) < new Date()) {
      throw new ValidationError('Survey has expired');
    }

    // Check if user already completed this survey
    const existingAnswers = await Answer.findAll({
      where: {
        user_id: userId,
        question_id: {
          [Op.in]: survey.questions.map((q) => q.id),
        },
      },
      transaction,
    });

    if (existingAnswers.length === survey.questions.length) {
      throw new ValidationError('Survey already completed');
    }

    // Validate answers
    if (!Array.isArray(answers) || answers.length === 0) {
      throw new ValidationError('Answers array is required');
    }

    // Validate all required questions are answered
    const answeredQuestionIds = new Set(answers.map((a) => a.question_id));
    const requiredQuestions = survey.questions.filter((q) => q.is_required);

    for (const question of requiredQuestions) {
      if (!answeredQuestionIds.has(question.id.toString())) {
        throw new ValidationError(`Required question ${question.text} is not answered`);
      }
    }

    // Create/update answers
    const answerRecords = [];
    for (const answerData of answers) {
      const { question_id, answer_text, answer_options } = answerData;

      // Find question
      const question = survey.questions.find((q) => q.id.toString() === question_id.toString());
      if (!question) {
        throw new ValidationError(`Question ${question_id} not found in survey`);
      }

      // Validate answer based on question type
      if (question.type === 'single_choice' || question.type === 'yes_no') {
        if (!answer_options || !Array.isArray(answer_options) || answer_options.length !== 1) {
          throw new ValidationError(`Question ${question.text} requires a single choice`);
        }
      } else if (question.type === 'multiple_choice') {
        if (!answer_options || !Array.isArray(answer_options) || answer_options.length === 0) {
          throw new ValidationError(`Question ${question.text} requires at least one choice`);
        }
      } else if (question.type === 'text' || question.type === 'number' || question.type === 'rating') {
        if (!answer_text) {
          throw new ValidationError(`Question ${question.text} requires a text answer`);
        }
      }

      // Check if answer already exists
      const existingAnswer = existingAnswers.find(
        (a) => a.question_id.toString() === question_id.toString()
      );

      if (existingAnswer) {
        // Update existing answer
        await existingAnswer.update(
          {
            answer_text: answer_text || null,
            answer_options: answer_options || null,
          },
          { transaction }
        );
        answerRecords.push(existingAnswer);
      } else {
        // Create new answer
        const answer = await Answer.create(
          {
            user_id: userId,
            question_id: question.id,
            answer_text: answer_text || null,
            answer_options: answer_options || null,
          },
          { transaction }
        );
        answerRecords.push(answer);
      }
    }

    // Check if all questions are now answered
    const allAnswers = await Answer.findAll({
      where: {
        user_id: userId,
        question_id: {
          [Op.in]: survey.questions.map((q) => q.id),
        },
      },
      transaction,
    });

    const isCompleted = allAnswers.length === survey.questions.length;

    // If survey completed, give golbucks reward
    let golbucksResult = null;
    if (isCompleted && survey.golbucks_reward > 0) {
      golbucksResult = await addGolbucks(
        userId,
        survey.golbucks_reward,
        'survey_completion',
        `Anket tamamlama: ${survey.title}`,
        { survey_id: surveyId },
        transaction
      );
    }

    await transaction.commit();

    return {
      success: true,
      isCompleted,
      golbucksReward: isCompleted ? survey.golbucks_reward : 0,
      newBalance: golbucksResult ? golbucksResult.newBalance : null,
      answers: answerRecords,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Get user's survey answers
 * @param {string} userId - User ID
 * @param {string} surveyId - Survey ID
 * @returns {Promise<Array>} User's answers
 */
const getUserSurveyAnswers = async (userId, surveyId) => {
  const answers = await Answer.findAll({
    where: {
      user_id: userId,
    },
    include: [
      {
        model: Question,
        as: 'question',
        where: {
          survey_id: surveyId,
        },
        required: true,
      },
    ],
    order: [['question', 'order', 'ASC']],
  });

  return answers;
};

module.exports = {
  getActiveSurveys,
  getSurveyById,
  submitSurveyAnswers,
  getUserSurveyAnswers,
};

