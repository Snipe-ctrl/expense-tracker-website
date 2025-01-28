const { verify } = require('jsonwebtoken');
const { findUserById } = require('../services/userService');

const protected = async (req, res, next) => {
    console.log('Authorization Header:', req.headers['authorization']); // Debug log

    const authorization = req.headers['authorization'];
    if (!authorization) {
        console.error('🚨 No token provided!');
        return res.status(401).json({ message: 'No token provided!' });
    }

    const token = authorization.split(' ')[1];
    console.log('Extracted Token:', token); // Debug log

    try {
        const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log('Decoded Token:', decoded); // Debug log

        req.user = await findUserById(decoded.id);
        if (!req.user) {
            console.error(`🚨 User with ID ${decoded.id} not found!`);
            return res.status(404).json({ message: "User doesn't exist!" });
        }

        next();
    } catch (err) {
        console.error('🚨 Token Verification Error:', err.message);
        return res.status(403).json({ message: `Invalid token! Reason: ${err.message}` });
    }
};

module.exports = { protected };
