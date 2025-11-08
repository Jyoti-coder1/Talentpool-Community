// src/routes/match.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { recommendProjects } = require('../controllers/matchController');

router.get('/projects', auth, recommendProjects);

module.exports = router;