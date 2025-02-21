require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')

const indexRouter = require('./src/routes/otherRoutes')
const authRouter = require('./src/routes/authRoutes')

const app = express();

const PORT = process.env.PORT || 3001;

const allowedOrigins = [
    "http://localhost:3000",
    "https://app.snipectrl.com"
];

app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && req.headers["x-forwarded-proto"] !== "https") {
        return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
});

app.use(cors({
    origin: allowedOrigins, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, 
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
	
app.use('/api', indexRouter)
app.use('/api/auth', authRouter)

app.use(express.static(path.resolve(__dirname, 'dist')));

app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.listen(PORT, () => {
    console.log(`Server running on ${process.env.NODE_ENV}`);
});