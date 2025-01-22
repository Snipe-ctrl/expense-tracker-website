const { verify } = require('jsonwebtoken');
const { findUserById } = require('../services/userService');

const protected = async (req, res, next) => {
    const authorization = req.headers['authorization'];

    if (!authorization) {
        return res.status(401).json({ message: 'No token provided!' });
    }

    const token = authorization.split(' ')[1];
    let userId;

    try {
        userId = verify(token, process.env.ACCESS_TOKEN_SECRET).id;
    } catch {
        return res.status(403).json({ message: 'Invalid token!' });
    }

    const user = await findUserById(userId);
    if (!user) {
        return res.status(404).json({ message: "User doesn't exist!" });
    }

    req.user = user;
    next();
};

module.exports = { protected };
