const express = require('express');
const router = express.Router();
const db = require('../db');

// Get config
router.get('/', (req, res) => {
    db.get(`SELECT * FROM config WHERE id = 1`, (err, config) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(config);
    });
});

// Update config
router.post('/', (req, res) => {
    const { openai_key, training_data, evolution_api_url, evolution_api_key, evolution_instance_name } = req.body;

    db.run(`UPDATE config SET 
    openai_key = ?, 
    training_data = ?, 
    evolution_api_url = ?, 
    evolution_api_key = ?, 
    evolution_instance_name = ? 
    WHERE id = 1`,
        [openai_key, training_data, evolution_api_url, evolution_api_key, evolution_instance_name],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Config updated' });
        }
    );
});

module.exports = router;
