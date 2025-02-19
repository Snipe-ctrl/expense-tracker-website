const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.connect()
    .then(() => console.log('Connected to PostgreSQL successfully'))
    .catch((err) => console.error('Error connecting to PostgreSQL:', err));

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};