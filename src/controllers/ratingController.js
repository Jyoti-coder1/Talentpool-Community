// src/controllers/ratingController.js
const Rating = require('../models/Rating');
const User = require('../models/User');
const Project = require('../models/Project');

// ⭐ Add a rating
const addRating = async (req, res) => {
    try {
        const { targetUser, project, rating, feedback } = req.body;
        if (!rating) return res.status(400).json({ message: 'Rating required' });

        const newRating = await Rating.create({
            rater: req.user.userId,
            targetUser,
            project,
            rating,
            feedback,
        });

        res.status(201).json(newRating);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 📊 Get ratings summary (avg per user or project)
const getRatings = async (req, res) => {
    try {
        const { userId, projectId } = req.query;
        const query = {};
        if (userId) query.targetUser = userId;
        if (projectId) query.project = projectId;

        const ratings = await Rating.find(query).populate('rater', 'name');
        const avg =
            ratings.length > 0
                ? ratings.reduce((a, r) => a + r.rating, 0) / ratings.length
                : 0;

        res.json({ avgRating: avg.toFixed(2), count: ratings.length, ratings });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { addRating, getRatings };