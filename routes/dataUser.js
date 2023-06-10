const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authorization = require('../middleware/authorization');

// Get user data
router.get('/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const userData = await pool.query(
            'SELECT * FROM user_data WHERE user_id = $1',
            [id]
        );
        res.json(userData.rows[0]);
    } catch (err) {
        console.error(err.message);
        console.log(err.message);
        console.log('error di get user data');
    }
});

// Update user data
router.put('/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, name, birth_date, bio, jurusan_kuliah } = req.body;
        const updateUserData = await pool.query(
            'UPDATE user_data SET username = $1, email = $2, name = $3, birth_date = $4, jurusan_kuliah = $5, bio = $6 WHERE user_id = $7 RETURNING *',
            [username, email, name, birth_date, jurusan_kuliah, bio, id]
        );

        res.json(updateUserData.rows[0]);
    } catch (err) {
            console.error(err.message);
            console.log(err.message);
            console.log('error di update user data');
    }
});

module.exports = router;