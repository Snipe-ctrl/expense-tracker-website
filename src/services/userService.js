const db = require('./db');

// Create a new user
const createUser = async (name, email, password) => {
    const query = `
        INSERT INTO users (full_name, email, password)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [name, email, password];
    const result = await db.query(query, values);
    return result.rows[0];
};

// Find a user by email
const findUserByEmail = async (email) => {
    const query = `
        SELECT * FROM users WHERE email = $1;
    `;
    const result = await db.query(query, [email]);
    return result.rows[0];
};

// Find a user by ID
const findUserById = async (id) => {
    const query = `
        SELECT * FROM users WHERE id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
};

// Update the refresh token for a user
const updateRefreshToken = async (id, token) => {
    const query = `
        UPDATE users SET refreshtoken = $1 WHERE id = $2;
    `;
    await db.query(query, [token, id]);
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updateRefreshToken,
};
