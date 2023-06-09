const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./config/db');
const jwtGenerator = require('./utils/jwtGenerator');
const authorization = require('./middleware/authorization');
const getPosts = require('./routes/getPosts');
const getPostsById = require('./routes/getPostsById');
const auth = require('./routes/auth');
const createPosts = require('./routes/createPosts');
const deletePosts = require('./routes/deletePosts');
const dataUser = require('./routes/dataUser');
const chat = require('./routes/chat');

// middleware
app.use(cors()); // allows us to parse json
app.use(express.json()); // allows us to parse json

// ROUTES //
// create a post
app.use('/posts', createPosts);
// Delete a post using post_id
app.use('/posts', deletePosts);
// get all posts path
app.use('/posts', getPosts);
// get posts by id path
app.use('/posts', getPostsById);
// register and login also verify
app.use('/auth', auth);
// get user data and update user data
app.use('/user', dataUser);
// get chat data
app.use('/chat', chat);
// END ROUTES //

// Listen to port 5000
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});