const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./config/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwtGenerator = require('./utils/jwtGenerator');
const validInfo = require('./middleware/validInfo');
const authorization = require('./middleware/authorization');

// middleware
app.use(cors()); // allows us to parse json
app.use(express.json()); // allows us to parse json

// ROUTES //

// create a post
app.post('/post/:id', async (req, res) => {
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

// get all posts
app.get('/posts/all', authorization, async (req, res) => {
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
app.get('/posts/lost', authorization, async (req, res) => {
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
app.get('/posts/found', authorization, async (req, res) => {
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
app.get('/posts/share', authorization, async (req, res) => {
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

// Delete a post using post_id
app.delete('/posts/:id', authorization, async (req, res) => {
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

// get all posts
app.get('/posts/all/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const allPosts = await pool.query(
            `SELECT post_id, post.user_id, username, name, bio, birth_date, jurusan_kuliah, post_txt, rise_vote, post_date, status FROM post INNER JOIN user_data ON user_data.user_id = post.user_id WHERE post.user_id = $1 ORDER BY post_date DESC;`, [id]
        );
        res.json(allPosts.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get posts of where status lost
app.get('/posts/lost/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const allPosts = await pool.query(
            `SELECT post_id, post.user_id, username, post_txt, rise_vote, post_date, status FROM post INNER JOIN user_data ON user_data.user_id = post.user_id WHERE status = $1 AND post.user_id = $2 ORDER BY post_date DESC;`,
            ['Lost'], [id]
        );
        res.json(allPosts.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get posts of where status found
app.get('/posts/found/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const allPosts = await pool.query(
            `SELECT post_id, post.user_id, username, post_txt, rise_vote, post_date, status FROM post INNER JOIN user_data ON user_data.user_id = post.user_id WHERE status = $1 AND post.user_id = ${id} ORDER BY post_date DESC`,
            ['Found']
        );
        res.json(allPosts.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get posts of where status share
app.get('/posts/share/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const allPosts = await pool.query(
            `SELECT post_id, post.user_id, username, post_txt, rise_vote, post_date, status FROM post INNER JOIN user_data ON user_data.user_id = post.user_id WHERE status = $1 AND post.user_id = ${id} ORDER BY post_date DESC`,
            ['Share']
        );
        res.json(allPosts.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Delete post using post_id
app.delete('/posts/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const deletePost = await pool.query(
            'DELETE FROM post WHERE post_id = $1',
            [id]
        );
        
        res.json('Post deleted');

    } catch (err) {
        console.error(err.message);
    }
});


// Register
app.post('/register', async (req, res) => {
    try {
        // save the password using bcrypt
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        // get the username and password from the request body
        const { username, email, name, birth_date, jurusan_kuliah } = req.body;

        // check if username or email already exist
        const checkUsername = await pool.query(
            'SELECT * FROM user_data WHERE username = $1',
            [username]
        );
        const checkEmail = await pool.query(
            'SELECT * FROM user_data WHERE email = $1',
            [email]
        );

        // if username or email already exist, return error
        if (checkUsername.rows.length !== 0 && checkEmail.rows.length !== 0) {
            return res.status(401).json({ error: 'Email and username already exists' });
        } else if (checkEmail.rows.length !== 0) {
            return res.status(401).json({ error: 'Email already exists' });
        } else if (checkUsername.rows.length !== 0) {
            return res.status(401).json({ error: 'Username already exists' });
        }

        // insert into user table
        const newUser = await pool.query(
            'INSERT INTO user_data (username, email, name, birth_date, jurusan_kuliah, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [username, email, name, birth_date, jurusan_kuliah, hashedPassword]
        );

        res.json(newUser.rows[0]);
        console.log("Register success");

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
// Login using username and password
app.post('/login', validInfo, async (req, res) => {
    try {
        // get the username and password from the request body
        const { username, password } = req.body;

        // check if username already exist
        const checkUsername = await pool.query(
            'SELECT * FROM user_data WHERE username = $1',
            [username]
        );

        // if username already exist, return error
        if (checkUsername.rows.length === 0) {
            return res.status(401).json('Username not found');
        }

        // check if password is correct
        const checkPassword = await bcrypt.compare(password, checkUsername.rows[0].password);

        // if password is not correct, return error
        if (!checkPassword) {
            return res.status(401).json('Password is incorrect');
        }

        // generate jwt token
        const token = jwtGenerator(checkUsername.rows[0].user_id);
        
        // if username and password is correct, return the token and user_id
        res.json({ token, user_id: checkUsername.rows[0].user_id });

    } catch (err) {
        console.error(err.message);
    }
});

// To verify the access
app.get("/is-verify", authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Listen to port 5000
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});