// src/controllers/collabController.js
const Collaboration = require('../models/Collaboration');
const Project = require('../models/Project');
const User = require('../models/User');

// helper to get user id
const getUserId = (req) => req.user?.userId || req.user?._id;

// create collaboration for a project (project owner or participant can create)
const createCollaboration = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { projectId, participants = [] } = req.body;
        if (!projectId) return res.status(400).json({ message: 'projectId required' });

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // ensure participants include owner or at least one member
        const uniqueParts = Array.from(new Set([userId, ...participants]));

        const collab = await Collaboration.create({
            project: projectId,
            participants: uniqueParts
        });

        res.status(201).json(collab);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// get collaboration by id (only participants or admin)
const getCollaboration = async (req, res) => {
    try {
        const userId = getUserId(req);
        const collab = await Collaboration.findById(req.params.id)
            .populate('participants', 'name email')
            .populate('project', 'title');

        if (!collab) return res.status(404).json({ message: 'Not found' });

        const isParticipant = collab.participants.some(p => p._id.toString() === userId.toString());
        if (!isParticipant && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

        res.json(collab);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// add message via REST (socket will also save messages; this is fallback)
const addMessage = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'text required' });

        const collab = await Collaboration.findById(req.params.id);
        if (!collab) return res.status(404).json({ message: 'Collaboration not found' });

        const isParticipant = collab.participants.some(p => p.toString() === userId.toString());
        if (!isParticipant && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

        const msg = { sender: userId, text };
        collab.messages.push(msg);
        await collab.save();

        // return the added message (last one)
        const added = collab.messages[collab.messages.length - 1];
        res.status(201).json(added);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// list collaborations for current user
const listMyCollaborations = async (req, res) => {
    try {
        const userId = getUserId(req);
        const collabs = await Collaboration.find({ participants: userId })
            .populate('project', 'title')
            .populate('participants', 'name');
        res.json(collabs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createCollaboration,
    getCollaboration,
    addMessage,
    listMyCollaborations
};