const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const cors = require('cors');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.static(path.resolve(__dirname, 'dist')));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});