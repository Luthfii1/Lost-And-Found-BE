const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authorization = require('../middleware/authorization');

// Update status of status post become Gotcha!
router.put('/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const updateStatus = await pool.query(
            `UPDATE post SET status = $1 WHERE post_id = $2 RETURNING *`,
            ['Gotcha!', id]
        );
        res.json(updateStatus.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;