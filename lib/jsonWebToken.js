const jwt = require('jsonwebtoken');

// Create a json web token
async function CreateToken(data){
    const payload = {data};
    const secret = process.env.SECRET;
    const token = jwt.sign(payload, secret);
    return {token}
}

module.exports.CreateToken = CreateToken;
