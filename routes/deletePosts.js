const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authorization = require('../middleware/authorization');

router.delete('/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const deletePost = await pool.query(
            'DELETE FROM post WHERE post_id = $1 RETURNING *',
            [id]
        );
        res.json(deletePost.rows[0]);
    } catch (err) {
        console.error(err.message);
        console.log(err.message);
    }
});

module.exports = router;