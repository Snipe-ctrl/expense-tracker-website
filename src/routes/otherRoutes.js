const express = require('express')
const router = express.Router()
const db = require('../services/db')
const multer = require('multer');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');

const { protected } = require('../utils/auth-util/protected');
const exp = require('constants');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

router.get('/test', (req, res) => {
    res.send('Test route is working!');
});

router.post('/upload-profile-picture', protected, upload.single('profilePicture'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const fileContent = req.file.buffer;
    const params = {
        Bucket: 'expense-tracker-bucket01',
        Key: `profile-pictures/${req.file.originalname}`,
        Body: fileContent,
        ContentType: req.file.mimetype,
    };

    try {
        const data = await s3.upload(params).promise();
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

router.post('/update-account-settings', protected, async (req, res) => {

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
        full_name || req.user.full_name,
        timezone || req.user.timezone,
        profile_picture_url || req.user.profile_picture_url,
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

router.get('/expenses', protected, async (req, res) => {
    try {
        const userId = req.user.id;

        const year = parseInt(req.query.year);
        const month = parseInt(req.query.month);

        if (!month || !year) {
            return res.status(400).json({ 
                status: 'error', 
                message: "Month and year are required." 
            });
        }

        const firstDay = `${year}-${month.toString().padStart(2, '0')}-01`; 
        const queryParams = [userId, firstDay];

        const query = `
            SELECT id, description, category, amount, date, notes
            FROM expenses
            WHERE user_id = $1
            AND date >= $2::DATE
            AND date < ($2::DATE + INTERVAL '1 month')
            ORDER BY date DESC, created_at DESC;
        `;

        const result = await db.query(query, queryParams);

        if (result.rowCount === 0) {
            return res.status(200).json({
                status: 'success',
                data: [],
                message: "No expenses found for this month.",
            });
        }

        res.status(200).json({
            status: 'success',
            data: result.rows,
        });
        } catch (err) {
        console.error(`Error fetching expenses`, err.message, err.stack);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

router.post('/add-expense', protected, async (req, res) => {

    const userId = req.user.id;
    const { date, description, category, amount, notes } = req.body;

    if (!date || !description || !category || amount === undefined || amount === null || isNaN(amount)) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `INSERT INTO expenses (user_id, date, description, category, amount, notes)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;`;
    const values = [userId, date, description, category, amount, notes];

    try {
        const result = await db.query(query, values);

        res.status(201).json({
            message: "Expense added successfully",
            expense: result.rows[0],
        });

    } catch (err) {
        console.error('Error adding expense: ', err)
        res.status(500).json({ message: 'Internal server error' })
    };
});

router.put('/edit-expense/:expenseId', protected, async (req, res) => {
    const expenseId = req.params.expenseId;
    const { date, description, category, amount, notes } = req.body;

    if (!date || !description || !category || amount === undefined || amount === null || isNaN(amount)) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
    UPDATE expenses
    SET date = $1, description = $2, category = $3, amount = $4, notes = $5
    WHERE id = $6
    RETURNING *;
    `;
    const values = [date, description, category, amount, notes, expenseId];

    try {
        const result = await db.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        return res.status(200).json({
            message: "Expense updated successfully",
            expense: result.rows[0],
        });
    } catch (err) {
        console.error('Error updating expense', err);
        return res.status(500).json({ message: 'Internal server error' })
    }
});

router.post('/delete-expense', protected, async (req, res) => {

    const { expenseId } = req.body;

    if (!expenseId) {
        return res.status(400).json({ message: 'Expense Id is required' });
    }

    const query = `DELETE FROM expenses WHERE id = $1`;

    try {
        const result = await db.query(query, [expenseId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        return res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.error('Error deleting expense: ', err);
        return res.status(500).json({ message: 'Internal server error' })
    }
});

module.exports = router;