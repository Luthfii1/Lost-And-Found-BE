const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authorization = require('../middleware/authorization');
const validInfo = require('../middleware/validInfo');
// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');

const saltRounds = 10;
const jwtGenerator = require('../utils/jwtGenerator');

// Register
router.post('/register', async (req, res) => {
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
        console.log('Error di register');
    }
});

// Login
// Login using username and password
router.post('/login', validInfo, async (req, res) => {
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
            console.log('Username not found');
            return res.status(401).json('Username not found');
        }

        // check if password is correct
        const checkPassword = await bcrypt.compare(password, checkUsername.rows[0].password);

        // if password is not correct, return error
        if (!checkPassword) {
            console.log('Password is incorrect');
            return res.status(401).json('Password is incorrect');
        }

        // generate jwt token
        const token = jwtGenerator(checkUsername.rows[0].user_id, checkUsername.rows[0].username);
        
        // if username and password is correct, return the token and user_id
        res.json({ token, user_id: checkUsername.rows[0].user_id, username: checkUsername.rows[0].username });

    } catch (err) {
        console.error(err.message);
        console.log('Error di login');
    }
});

// To verify the access
router.get("/is-verify", authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
        console.log('Error di is-verify');
    }
});

module.exports = router;