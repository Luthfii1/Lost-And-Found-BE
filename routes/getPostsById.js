const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authorization = require('../middleware/authorization');

// Get user posts by param id
router.get('/all/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const userPosts = await pool.query(
            'SELECT post_id, post.user_id, username, post_txt, rise_vote, post_date, status FROM post INNER JOIN user_data ON user_data.user_id = post.user_id WHERE user_data.user_id = $1 ORDER BY post_date DESC;',
            [id]
        );
        
        res.json(userPosts.rows);
    } catch (err) {
        // console.error(err.message);
        console.log(err.message);
    }
});

// get posts of where status lost
router.get('/lost/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const allPosts = await pool.query(
            'SELECT post_id, post.user_id, username, post_txt, rise_vote, post_date, status FROM post INNER JOIN user_data ON user_data.user_id = post.user_id WHERE status = $1 AND user_data.user_id = $2 ORDER BY post_date DESC',
            ['Lost', id]
        );
        res.json(allPosts.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get posts of where status found
router.get('/found/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const allPosts = await pool.query(
            'SELECT post_id, post.user_id, username, post_txt, rise_vote, post_date, status FROM post INNER JOIN user_data ON user_data.user_id = post.user_id WHERE status = $1 AND user_data.user_id = $2 ORDER BY post_date DESC',
            ['Found', id]
        );
        res.json(allPosts.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get posts of where status share
router.get('/share/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const allPosts = await pool.query(
            'SELECT post_id, post.user_id, username, post_txt, rise_vote, post_date, status FROM post INNER JOIN user_data ON user_data.user_id = post.user_id WHERE status = $1 AND user_data.user_id = $2 ORDER BY post_date DESC',
            ['Share', id]
        );
        res.json(allPosts.rows);
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;