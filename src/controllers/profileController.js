const User = require('../models/User');

// Get current user's profile
const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update current user's profile
const updateMyProfile = async (req, res) => {
    try {
        const { name, bio, location, skills, portfolio } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (bio) updateData.bio = bio;
        if (location) updateData.location = location;
        if (skills) updateData.skills = skills;          // expect array
        if (portfolio) updateData.portfolio = portfolio; // expect array

        const updated = await User.findByIdAndUpdate(req.user.userId, updateData, {
            new: true,
        }).select('-password');

        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user profile by ID (public)
const getProfileById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Search users by skills or location
const searchUsers = async (req, res) => {
    try {
        const { skill, location } = req.query;

        const query = {};
        if (skill) query.skills = { $regex: skill, $options: 'i' };
        if (location) query.location = { $regex: location, $options: 'i' };

        const users = await User.find(query).select('-password');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getMyProfile,
    updateMyProfile,
    getProfileById,
    searchUsers,
};