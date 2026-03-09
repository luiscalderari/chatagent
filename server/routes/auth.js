const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Register (Initial setup)
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function (err) {
        if (err) return res.status(400).json({ error: 'User already exists' });
        res.json({ message: 'User created' });
    });
});

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt for:', username);

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) {
            console.error('DB Error:', err);
            return res.status(500).json({ error: 'Internal error' });
        }

        if (!user) {
            console.log('User not found in DB:', username);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const valid = bcrypt.compareSync(password, user.password);
        console.log('Bcrypt comparison for', username, ':', valid);

        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    });
});

module.exports = router;
