const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Name: {type: String, },
    Password: {type: String},
    Gender: {type: String},
    Hostel: {type: String},
    PhoneNo: {type: String},
    Email: {type: String},
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
