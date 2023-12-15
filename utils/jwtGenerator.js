const jwt = require('jsonwebtoken');

function jwtGenerator(user_id, username){
    const payload = {
        user: user_id,
        username: username
    }
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { algorithm: 'HS256'})
    
}

module.exports = jwtGenerator;