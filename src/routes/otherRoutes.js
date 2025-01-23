const express = require('express')
const router = express.Router()
const db = require('../services/db')
const multer = require('multer');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

router.get('/test', (req, res) => {
    res.send('Test route is working!');
});

router.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.rows[0]);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send('Server error');
    }
});

router.post('/api/upload-profile-picture', upload.single('profilePicture'), async (req, res) => {

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

        const imageUrl = data.Location;
        const userId = req.body.userId;
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

router.post('/api/update-account-settings', async (req, res) => {
    const { id, full_name, email, timezone, profile_picture_url } = req.body;

    if (!id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    const query = `
        UPDATE users
        SET
            full_name = $1,
            email = $2,
            timezone = $3,
            profile_picture_url = $4
        WHERE id = $5
        RETURNING *;
    `;

    const values = [
        full_name || null,
        email,
        timezone || null,
        profile_picture_url || null,
        id,
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

module.exports = router;