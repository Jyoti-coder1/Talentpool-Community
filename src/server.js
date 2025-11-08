// src/server.js
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const connectDB = require('./config/db');
const Collaboration = require('./models/Collaboration'); // 👈 for chat persistence

// Initialize app
const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Base route
app.get('/', (req, res) => res.send('TalentPool backend is running 🚀'));

// ---------------- ROUTES ----------------
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const protectedRoutes = require('./routes/protected');
app.use('/api/protected', protectedRoutes);

const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

const projectRoutes = require('./routes/projectRoutes');
app.use('/api/projects', projectRoutes);

//const adminRoutes = require('./routes/admin');
//app.use('/api/admin', adminRoutes);

// 🧩 NEW Day 4 routes
const matchRoutes = require('./routes/match');
app.use('/api/match', matchRoutes);

const collabRoutes = require('./routes/collab');
app.use('/api/collab', collabRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({ message: 'Server error' });
});

// ---------------- SOCKET.IO SETUP ----------------
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // ⚠️ change to your frontend origin in production
        methods: ['GET', 'POST']
    }
});

// ✅ Authenticate socket users using JWT
io.use((socket, next) => {
    try {
        const token =
            socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.split(' ')[1];
        if (!token) return next(new Error('Authentication error: token required'));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded; // { userId, role }
        next();
    } catch (err) {
        console.error('Socket auth failed:', err.message);
        next(new Error('Authentication error'));
    }
});

// ✅ Socket connection handler
io.on('connection', (socket) => {
    const userId = socket.user?.userId || socket.user?._id;
    console.log(`User connected: ${userId} (${socket.id})`);

    // join collaboration room
    socket.on('joinRoom', ({ collabId }) => {
        if (!collabId) return;
        socket.join(collabId);
        console.log(`User ${userId} joined room ${collabId}`);
    });

    // send and broadcast messages
    socket.on('sendMessage', async ({ collabId, text }) => {
        if (!collabId || !text) return;
        try {
            const collab = await Collaboration.findById(collabId);
            if (!collab) return socket.emit('error', { message: 'Collaboration not found' });

            // check participation
            const isParticipant = collab.participants.some(
                (p) => p.toString() === userId.toString()
            );
            if (!isParticipant && socket.user.role !== 'admin')
                return socket.emit('error', { message: 'Not a participant' });

            // save message in DB
            const msg = { sender: userId, text, createdAt: new Date() };
            collab.messages.push(msg);
            await collab.save();

            // emit message to all participants
            io.to(collabId).emit('newMessage', {
                collabId,
                message: {
                    sender: userId,
                    text,
                    createdAt: msg.createdAt,
                },
            });
        } catch (err) {
            console.error('Error sending socket message:', err.message);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log('🌿 MONGO_URI from env:', process.env.MONGO_URI);