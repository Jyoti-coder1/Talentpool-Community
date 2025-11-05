const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    getMyProfile,
    updateMyProfile,
    getProfileById,
    searchUsers
} = require('../controllers/profileController');

// Logged-in user's profile
router.get('/me', auth, getMyProfile);
router.put('/me', auth, updateMyProfile);

// Public: get user by ID
router.get('/:id', getProfileById);

// Public: search by skill/location
router.get('/', searchUsers);

module.exports = router;