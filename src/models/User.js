// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'projectOwner', 'admin'], default: 'user' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    skills: [{ type: String }],
    portfolio: [{ type: String }],
    ownedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    joinedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);