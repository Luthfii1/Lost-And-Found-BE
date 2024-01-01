const jwt = require('jsonwebtoken');

// JWT Generator
function jwtGenerator(user_id, username){
    const payload = {
        user: user_id,
        username: username
    }
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { algorithm: 'HS256', expiresIn: "1hr"})
}

module.exports = jwtGenerator;