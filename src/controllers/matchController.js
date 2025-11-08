// src/controllers/matchController.js
const Project = require('../models/Project');
const User = require('../models/User');

// simple matching: matchRatio = matchedSkills / requiredSkillsLength
// returns projects sorted by ratio desc; supports '?limit=10'
const recommendProjects = async (req, res) => {
    try {
        const userId = req.user?.userId || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { limit = 10, minRatio = 0 } = req.query;

        // fetch open projects (you can expand filters)
        const projects = await Project.find({ status: 'open' }).lean();

        // compute match ratio for each
        const userSkills = (user.skills || []).map(s => s.toLowerCase());

        const scored = projects.map(p => {
            const reqSkills = (p.skillsRequired || []).map(s => s.toLowerCase());
            if (reqSkills.length === 0) return { project: p, ratio: 0 };

            const matched = reqSkills.filter(rs => userSkills.includes(rs)).length;
            const ratio = matched / reqSkills.length; // fraction of required skills matched
            return { project: p, ratio };
        });

        // filter by minRatio and sort descending
        const filtered = scored
            .filter(s => s.ratio >= Number(minRatio))
            .sort((a, b) => b.ratio - a.ratio)
            .slice(0, Number(limit));

        // attach ratio to response and populate owner info
        const result = await Promise.all(filtered.map(async item => {
            const full = await Project.findById(item.project._id).populate('owner', 'name email');
            return { project: full, matchRatio: item.ratio };
        }));

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { recommendProjects };