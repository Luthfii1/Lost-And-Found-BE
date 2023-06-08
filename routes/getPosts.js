const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authorization = require('../middleware/authorization');

// get all posts
router.get('/all', authorization, async (req, res) => {
    try {
        const allPosts = await pool.query(
            'SELECT post_id, post.user_id, username, post_txt, rise_vote, post_date, status FROM post INNER JOIN user_data ON user_data.user_id = post.user_id ORDER BY post_date DESC;'
        );
        res.json(allPosts.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get posts of where status lost
router.get('/lost', authorization, async (req, res) => {
    try {
        const allPosts = await pool.query(
            'SELECT post_id, post.user_id, username, post_txt, rise_vote, post_date, status FROM post INNER JOIN user_data ON user_data.user_id = post.user_id WHERE status = $1 ORDER BY post_date DESC',
            ['Lost']
        );
        res.json(allPosts.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get posts of where status found
router.get('/found', authorization, async (req, res) => {
    try {
        const allPosts = await pool.query(
            'SELECT post_id, post.user_id, username, post_txt, rise_vote, post_date, status FROM post INNER JOIN user_data ON user_data.user_id = post.user_id WHERE status = $1 ORDER BY post_date DESC',
            ['Found']
        );
        res.json(allPosts.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get posts of where status share
router.get('/share', authorization, async (req, res) => {
    try {
        const allPosts = await pool.query(
            'SELECT post_id, post.user_id, username, post_txt, rise_vote, post_date, status FROM post INNER JOIN user_data ON user_data.user_id = post.user_id WHERE status = $1 ORDER BY post_date DESC',
            ['Share']
        );
        res.json(allPosts.rows);
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;