// src/models/Collaboration.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const collaborationSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // users in this collaboration
    messages: [messageSchema], // persisted chat messages
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Collaboration', collaborationSchema);