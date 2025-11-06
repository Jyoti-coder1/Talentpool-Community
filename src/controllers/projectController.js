// src/controllers/projectController.js
const Project = require('../models/Project.js');
const  User = require('../models/User.js');

const createProject = async (req, res) => {
    try {
        const project = await Project.create({
            ...req.body,
            owner: req.user._id,
        });
        await User.findByIdAndUpdate(req.user,_id, {
            $push: { ownedProjects: project._id },
        });
    
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update project (owner or admin)
const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Not found" });

        if (project.owner.toString() !== req.user._id.toString() && req.user.role !== "admin")
            return res.status(403).json({ message: "Not authorized" });

        const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete project
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Not found" });

        if (project.owner.toString() !== req.user._id.toString() && req.user.role !== "admin")
            return res.status(403).json({ message: "Not authorized" });

        await project.deleteOne();
        res.json({ message: "Project deleted" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all or search filter
const getAllProjects = async (req, res) => {
    try {
        const { skill, status } = req.query;
        const query = {};

        if (skill) query.skillsRequired = { $in: [skill] };
        if (status) query.status = status;

        const projects = await Project.find(query).populate("owner", "name email");
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Join project + waitlist
const joinProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const alreadyIn = project.collaborators.includes(req.user._id);
        const alreadyWaitlisted = project.waitlist.includes(req.user._id);

        if (alreadyIn || alreadyWaitlisted)
            return res.status(400).json({ message: "Already joined or waitlisted" });

        if (project.collaborators.length < project.maxCollaborators) {
            project.collaborators.push(req.user._id);
            await project.save();
            await User.findByIdAndUpdate(req.user._id, {
                $push: { joinedProjects: project._id }, 
            });
            res.json({ message: "Successfully joined project" });
        } else {
            project.waitlist.push(req.user._id);
            await project.save();
            res.json({ message: "Project full — added to waitlist" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createProject,
    updateProject,
    deleteProject,
    getAllProjects,
    joinProject,
};