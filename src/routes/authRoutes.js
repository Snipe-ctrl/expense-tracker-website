const express = require('express');
const { hash, compare } = require('bcryptjs');
const { verify } = require('jsonwebtoken');
const {
    createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken,
    createPasswordResetToken,
} = require('../utils/auth-util/tokens');
const {
    transporter,
    createPasswordResetUrl,
    passwordResetTemplate,
    passwordResetConfirmationTemplate,
} = require('../utils/auth-util/email');
const { protected } = require('../utils/auth-util/protected');
const {
    createUser,
    findUserByEmail,
    findUserById,
    updateRefreshToken,
    updateUserPassword,
} = require('../services/userService');

const router = express.Router();

/* GET main auth page. */
router.get('/', async (req, res) => {
    res.send('Hello Express!! 👋, this is Auth end point');
});

// Sign up
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);
        if (user) {
            return res.status(409).json({
                message: 'User already exists! Try logging in. 😄',
                type: 'warning',
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ type: 'error', message: 'Invalid email address.' });
        }

        const passwordHash = await hash(password, 10);
        await createUser(email, passwordHash);

        res.status(200).json({
            message: 'User created successfully! 🥳',
            type: 'success',
        });
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            type: 'error',
            message: 'Error creating user!',
            error,
        });
    }
});

// Sign in
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                message: "User doesn't exist! 😢",
                type: 'error',
            });
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Password is incorrect! ⚠️',
                type: 'error',
            });
        }

        const accessToken = createAccessToken(user.id);
        const refreshToken = createRefreshToken(user.id);

        await updateRefreshToken(user.id, refreshToken);

        sendRefreshToken(res, refreshToken);
        sendAccessToken(req, res, accessToken);
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            type: 'error',
            message: 'Error signing in!',
            error,
        });
    }
});

// Refresh token
router.post('/refresh_token', async (req, res) => {
    try {
        const { refreshtoken } = req.cookies;
        if (!refreshtoken) {
            return res.status(401).json({
                message: 'No refresh token! 🤔',
                type: 'error',
            });
        }

        let userId;
        try {
            userId = verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET).id;
        } catch {
            return res.status(403).json({
                message: 'Invalid refresh token! 🤔',
                type: 'error',
            });
        }

        const user = await findUserById(userId);
        if (!user || user.refreshtoken !== refreshtoken) {
            return res.status(403).json({
                message: 'Invalid refresh token! 🤔',
                type: 'error',
            });
        }

        const accessToken = createAccessToken(user.id);
        const newRefreshToken = createRefreshToken(user.id);

        await updateRefreshToken(user.id, newRefreshToken);

        sendRefreshToken(res, newRefreshToken);
        res.json({ accessToken });
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            type: 'error',
            message: 'Error refreshing token!',
            error,
        });
    }
});

// Password reset
router.post('/send-password-reset-email', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                message: "User doesn't exist! 😢",
                type: 'error',
            });
        }

        const token = createPasswordResetToken(user);

        const url = createPasswordResetUrl(user.id, token);
        const mailOptions = passwordResetTemplate(user, url);
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({
                    message: 'Error sending email! 😢',
                    type: 'error',
                });
            }

            res.json({
                message: 'Password reset link has been sent to your email! 📧',
                type: 'success',
            });
        });
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            type: 'error',
            message: 'Error sending email!',
            error,
        });
    }
});

// Reset password
router.post('/reset-password/:id/:token', async (req, res) => {
    try {
        const { id, token } = req.params;
        const { newPassword } = req.body;

        const user = await findUserById(id);
        if (!user) {
            return res.status(404).json({
                message: "User doesn't exist! 😢",
                type: 'error',
            });
        }

        const isValid = verify(token, user.password);
        if (!isValid) {
            return res.status(403).json({
                message: 'Invalid token! 😢',
                type: 'error',
            });
        }

        const hashedPassword = await hash(newPassword, 10);
        await updateUserPassword(id, hashedPassword);

        const mailOptions = passwordResetConfirmationTemplate(user);
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({
                    message: 'Error sending email! 😢',
                    type: 'error',
                });
            }

            res.json({
                message: 'Password reset successful! 📧',
                type: 'success',
            });
        });
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            type: 'error',
            message: 'Error resetting password!',
            error,
        });
    }
});

router.get('/protected', protected, async (req, res) => {
    try {
        if (req.user) {
            return res.json({
                message: 'You are logged in! 🤗',
                type: 'success',
                user: req.user,
            });
        }

        return res.status(401).json({
            message: 'You are not logged in! 😢',
            type: 'error',
        });
    } catch (error) {
        res.status(500).json({
            type: 'error',
            message: 'Error accessing protected route!',
            error,
        });
    }
});


module.exports = router;
