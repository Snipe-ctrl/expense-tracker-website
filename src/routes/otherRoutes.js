const express = require('express')
const router = express.Router()
const db = require('./db')

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

router.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        res.json(user.rows[0])
    } catch (err) {
        res.status(500).send('Server error');
    }
})

module.exports = router