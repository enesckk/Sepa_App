const express = require('express');
const router = express.Router();
const {
  createBillSupport,
  getUserBillSupports,
  getBillSupportById,
  getPublicBillSupports,
  supportBillSupport,
} = require('../controllers/billSupportController');
const { authenticate } = require('../middleware/auth');
const { uploadSingle } = require('../config/multer');

/**
 * @route   POST /api/bill-supports
 * @desc    Create bill support request (Askıda Fatura)
 * @access  Private
 * @body    bill_type, amount, description
 * @file    image (optional)
 */
router.post(
  '/',
  authenticate,
  uploadSingle('image'),
  createBillSupport
);

/**
 * @route   GET /api/bill-supports
 * @desc    Get user's bill support requests
 * @access  Private
 * @query   bill_type, status, search, limit, offset, sort, order
 */
router.get('/', authenticate, getUserBillSupports);

/**
 * @route   GET /api/bill-supports/public
 * @desc    Get public bill supports (for support tab)
 * @access  Public (but authenticated users can see more details)
 * @query   bill_type, status, search, limit, offset, sort, order
 */
router.get('/public', authenticate, getPublicBillSupports);

/**
 * @route   POST /api/bill-supports/:id/support
 * @desc    Support a bill (contribute money)
 * @access  Private
 * @body    amount, payment_method (golbucks|direct), notes (optional)
 */
router.post('/:id/support', authenticate, supportBillSupport);

/**
 * @route   GET /api/bill-supports/:id
 * @desc    Get bill support by ID
 * @access  Private
 */
router.get('/:id', authenticate, getBillSupportById);

module.exports = router;

