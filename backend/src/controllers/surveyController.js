const {
  getActiveSurveys,
  getSurveyById,
  submitSurveyAnswers,
  getUserSurveyAnswers,
} = require('../services/surveyService');

/**
 * Get all active surveys
 * GET /api/surveys
 */
const getSurveys = async (req, res, next) => {
  try {
    const userId = req.userId || null; // Optional: to check if completed

    const surveys = await getActiveSurveys(userId);

    res.status(200).json({
      success: true,
      data: {
        surveys,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get survey by ID
 * GET /api/surveys/:id
 */
const getSurveyByIdEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId || null; // Optional: to check if completed

    const survey = await getSurveyById(id, userId);

    res.status(200).json({
      success: true,
      data: {
        survey,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit survey answers
 * POST /api/surveys/:id/submit
 */
const submitSurvey = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Answers array is required',
      });
    }

    const result = await submitSurveyAnswers(userId, id, answers);

    res.status(200).json({
      success: true,
      message: result.isCompleted
        ? 'Survey completed successfully'
        : 'Answers submitted successfully',
      data: {
        isCompleted: result.isCompleted,
        golbucksReward: result.golbucksReward,
        newBalance: result.newBalance,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's survey answers
 * GET /api/surveys/:id/my-answers
 */
const getMyAnswers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const answers = await getUserSurveyAnswers(userId, id);

    res.status(200).json({
      success: true,
      data: {
        answers,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSurveys,
  getSurveyById: getSurveyByIdEndpoint,
  submitSurvey,
  getMyAnswers,
};

