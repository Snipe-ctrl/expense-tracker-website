const express = require('express')
const router = express.Router()
const db = require('../services/db')
const multer = require('multer');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');

const { protected } = require('../utils/protected');

const upload = multer({ dest: 'uploads/' });

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

router.get('/test', (req, res) => {
    res.send('Test route is working!');
});

router.post('/api/upload-profile-picture', protected, upload.single('profilePicture'), async (req, res) => {

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const fileContent = fs.readFileSync(req.file.path);
    const params = {
        Bucket: 'expense-tracker-bucket01',
        Key: `profile-pictures/${req.file.originalname}`,
        Body: fileContent,
        ContentType: req.file.mimetype,
    };

    try {
        const data = await s3.upload(params).promise();

        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting temporary file:', err);
        });        

        const imageUrl = data.Location;
        const userId = req.user.id;
        const query = `UPDATE users SET profile_picture_url = $1 WHERE id = $2 RETURNING *`;
        const values = [imageUrl, userId]

        const result = await db.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ url: imageUrl, user: result.rows[0] });
    } catch (error) {
        console.error('S3 upload error:', error);
        res.status(500).send('Failed to upload file and save file');
    }
});

router.post('/api/update-account-settings', protected, async (req, res) => {

    const userId = req.user.id;
    const { full_name, timezone, profile_picture_url } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    const query = `
        UPDATE users
        SET
            full_name = $1,
            timezone = $2,
            profile_picture_url = $3
        WHERE id = $4
        RETURNING *;
    `;

    const values = [
        full_name || user.full_name,
        timezone || user.timezone,
        profile_picture_url || user.profile_picture_url,
        userId,
    ];

    console.log(values)

    try {
        const result = await db.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Account settings updated successfully",
            user: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating account settings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/api/expenses', protected, async (req, res) => {
    try {
        const userId = req.user.id;

        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = parseInt(req.query.offset, 10) || 0;

        const query = `SELECT id, description, category, amount, date 
        FROM expenses WHERE user_id = $1 LIMIT $2 OFFSET $3;`;
        const result = await db.query(query, [userId, limit, offset]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: "No expenses found for this user",
            });
        }
        
        res.status(200).json({
            status: 'success',
            data: result.rows,
        });
        } catch (err) {
        console.error(`Error fetching expenses for user ${userId}`, err.message, err.stack);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

module.exports = router;