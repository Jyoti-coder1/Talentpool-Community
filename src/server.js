// src/server.js
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

// 🧩 Only import and connect DB if not testing
if (process.env.NODE_ENV !== 'test') {
    const connectDB = require('./config/db');
    connectDB();
}

// Import models used in sockets
const Collaboration = require('./models/Collaboration');

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- BASE ROUTE ----------------
app.get('/', (req, res) => res.send('TalentPool backend is running 🚀'));

// ---------------- ROUTES ----------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/protected', require('./routes/protected'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/ratings', require('./routes/ratingRoutes'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/match', require('./routes/match'));
app.use('/api/collab', require('./routes/collab'));

// ---------------- ERROR HANDLER ----------------
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({ message: 'Server error' });
});

// ---------------- SOCKET.IO SETUP ----------------
// ⚠️ Only start socket & server if not testing
if (process.env.NODE_ENV !== 'test') {
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: '*', // ⚠️ Replace with frontend origin in production
            methods: ['GET', 'POST'],
        },
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

        socket.on('joinRoom', ({ collabId }) => {
            if (!collabId) return;
            socket.join(collabId);
            console.log(`User ${userId} joined room ${collabId}`);
        });

        socket.on('sendMessage', async ({ collabId, text }) => {
            if (!collabId || !text) return;
            try {
                const collab = await Collaboration.findById(collabId);
                if (!collab) return socket.emit('error', { message: 'Collaboration not found' });

                const isParticipant = collab.participants.some(
                    (p) => p.toString() === userId.toString()
                );
                if (!isParticipant && socket.user.role !== 'admin')
                    return socket.emit('error', { message: 'Not a participant' });

                const msg = { sender: userId, text, createdAt: new Date() };
                collab.messages.push(msg);
                await collab.save();

                io.to(collabId).emit('newMessage', {
                    collabId,
                    message: { sender: userId, text, createdAt: msg.createdAt },
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
}

// Export app for Jest tests
module.exports = app;