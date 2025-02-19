require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001"

const indexRouter = require('./src/routes/otherRoutes')
const authRouter = require('./src/routes/authRoutes')

const app = express();

const PORT = process.env.PORT || 3001;

const allowedOrigins = [
    "http://localhost:3000", 
    "https://your-frontend-app.herokuapp.com"
];

app.use(cors({
    origin: allowedOrigins, 
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
app.use('/api/auth', authRouter)
app.use(express.static(path.resolve(__dirname, 'dist')));

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

console.log("Running in:", process.env.NODE_ENV);
console.log("API Base URL:", API_BASE_URL);
console.log("Port:", PORT);

app.listen(PORT, () => {
    console.log(`Server running on ${process.env.NODE_ENV}`);
});