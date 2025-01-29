require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')

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

app.get('/', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});
	
app.use('/api', indexRouter)
app.use('/auth', authRouter)
app.use(express.static(path.resolve(__dirname, 'dist')));

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});