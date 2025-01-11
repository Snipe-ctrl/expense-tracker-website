require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

const indexRouter = require('./src/js/routes/index')
const authRouter = require('./src/js/routes/auth')

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', indexRouter)
app.use('/auth', authRouter)

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.static(path.resolve(__dirname, 'dist')));

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('MongoDB connection is established successfully! 🎉')
	})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});