// src/routes/ratingRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { addRating, getRatings } = require('../controllers/ratingController');

// Add rating (auth required)
router.post('/', auth, addRating);

// Get all or filtered ratings
router.get('/:projectId', getRatings);

module.exports = router;