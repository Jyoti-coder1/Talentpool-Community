// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'No token, authorization denied' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            _id: decoded.userId,
            role: decoded.role,
            name: decoded.name
        };
        next();
    } catch (err) {
        console.err('JWT verification error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth;