// src/routes/admin.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { getAnalytics } = require('../controllers/adminController');

// Only admins can access analytics
router.get('/analytics', auth, authorizeRoles('admin'), getAnalytics);

module.exports = router;