const jwt = require('jsonwebtoken');

// Create a json web token
async function CreateToken(data){
    const payload = {data};
    const secret = process.env.SECRET;
    return await jwt.sign(payload, secret);
}

module.exports = CreateToken;
