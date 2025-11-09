// src/models/Rating.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    rater: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    rating: { type: Number, min: 1, max: 5, required: true },
    feedback: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Rating', ratingSchema);