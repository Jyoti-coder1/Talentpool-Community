// src/controllers/adminController.js
const User = require('../models/User');
const Project = require('../models/Project');
const Rating = require('../models/Rating');

const getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProjects = await Project.countDocuments();
        const totalRatings = await Rating.countDocuments();

        res.json({
            users: totalUsers,
            projects: totalProjects,
            ratings: totalRatings,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAnalytics };