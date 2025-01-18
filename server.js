require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

const indexRouter = require('./src/routes/otherRoutes')
const authRouter = require('./src/routes/authRoutes')

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, 
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('MongoDB connection is established successfully! 🎉')
	})

app.use('/', indexRouter)
app.use('/auth', authRouter)

app.use(express.static(path.resolve(__dirname, 'dist')));
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});