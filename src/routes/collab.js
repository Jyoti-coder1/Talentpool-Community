// src/routes/collab.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    createCollaboration,
    getCollaboration,
    addMessage,
    listMyCollaborations
} = require('../controllers/collabController');

// create a collaboration (authenticated)
router.post('/', auth, createCollaboration);

// list collaborations for current user
router.get('/me', auth, listMyCollaborations);

// get collaboration details
router.get('/:id', auth, getCollaboration);

// post message (fallback REST)
router.post('/:id/messages', auth, addMessage);

module.exports = router;