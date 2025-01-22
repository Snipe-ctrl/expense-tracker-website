const express = require('express')
const router = express.Router()
const db = require('../services/db')

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

router.get('/test', (req, res) => {
    res.send('Test route is working!');
});

router.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.rows[0]);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send('Server error');
    }
});


module.exports = router