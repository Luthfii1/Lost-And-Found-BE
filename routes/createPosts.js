const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authorization = require('../middleware/authorization');

router.post('/:id', authorization, async (req, res) => {
    try {
        const { post_txt, status } = req.body;
        
        // get user_id from params
        const { id } = req.params;

        // insert into post table
        const newPost = await pool.query(
            'INSERT INTO post ( post_txt, status, user_id) VALUES ($1, $2, $3) RETURNING *',
            [ post_txt, status, id]
        );

        res.json(newPost.rows[0]);
    } catch (err) {
        console.error(err.message);
        console.log(err.message);
    }
});

module.exports = router;