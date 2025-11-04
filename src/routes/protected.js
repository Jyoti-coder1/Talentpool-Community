const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

router.get('/me', auth, (req, res) => {
    res.json({ message: 'Protected route', user: req.user });
});

module.exports = router;