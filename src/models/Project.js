const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    skillsRequired: [{ type: String }],
    maxCollaborators: { type: Number, default: 5 },
    deadline: { type: Date },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    waitlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
        type: String,
        enum: ["open", "in-progress", "completed"],
        default: "open",
    },
});

module.exports = mongoose.model("Project", projectSchema);