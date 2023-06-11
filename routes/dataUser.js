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
router.put('/update/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const { username, name, birth_date, bio, jurusan_kuliah } = req.body;

        // Check the user change her username or not if change check the username is already exist or not
        const checkUsername = await pool.query(
            'SELECT username FROM user_data WHERE user_id = $1',
            [id]
        );

        if (checkUsername.rows[0].username !== username && username !== '') {
            const checkUsernameExist = await pool.query(
                'SELECT username FROM user_data WHERE username = $1',
                [username]
            );

            if (checkUsernameExist.rows[0]) {
                return res.status(401).json({ error: 'Username already exists' });
            } else {
                const updateUserData = await pool.query(
                    'UPDATE user_data SET username = $1, name = $2, birth_date = $3, jurusan_kuliah = $4, bio = $5 WHERE user_id = $6 RETURNING *',
                    [username, name, birth_date, jurusan_kuliah, bio, id]
                );
                res.json(updateUserData.rows[0]);
            }
        } else {
            // Without changing username
            const updateUserData = await pool.query(
                'UPDATE user_data SET name = $1, birth_date = $2, jurusan_kuliah = $3, bio = $4 WHERE user_id = $5 RETURNING *',
                [name, birth_date, jurusan_kuliah, bio, id]
            );
            res.json(updateUserData.rows[0]);
        }


    } catch (err) {
            console.error(err.message);
            console.log(err.message);
            console.log('error di update user data');
    }
});

module.exports = router;