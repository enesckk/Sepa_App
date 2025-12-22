const express = require('express');
const router = express.Router();
const {
  getSurveys,
  getSurveyById,
  submitSurvey,
  getMyAnswers,
} = require('../controllers/surveyController');
const { authenticate } = require('../middleware/auth');

/**
 * @route   GET /api/surveys
 * @desc    Get all active surveys (public, but can check if user completed)
 * @access  Public (optional auth to check completion status)
 */
router.get('/', getSurveys);

/**
 * @route   GET /api/surveys/:id
 * @desc    Get survey by ID with questions
 * @access  Public (optional auth to check completion status)
 */
router.get('/:id', getSurveyById);

/**
 * @route   POST /api/surveys/:id/submit
 * @desc    Submit survey answers
 * @access  Private
 * @body    { answers: [{ question_id, answer_text, answer_options }] }
 */
router.post('/:id/submit', authenticate, submitSurvey);

/**
 * @route   GET /api/surveys/:id/my-answers
 * @desc    Get user's answers for a survey
 * @access  Private
 */
router.get('/:id/my-answers', authenticate, getMyAnswers);

module.exports = router;

