const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { createUrl, getUrls, deleteUrl, getAnalytics } = require('../controllers/urlController');

// All these routes require the user to be logged in
router.post('/', protect, createUrl);
router.get('/', protect, getUrls);
router.delete('/:id', protect, deleteUrl);
router.get('/:id/analytics', protect, getAnalytics);

module.exports = router;