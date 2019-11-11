const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    Name: {type: String},
    Countable: {type: Boolean},
    Price: {type: String},
    Status: {type: String},
});

const VendorSchema = mongoose.Schema({
    Name: {type: String},
    Password: {type: String},
    Location: {type: String},
    PhoneNo: {type: String},
    Items: [ItemSchema],
});

const Vendor = mongoose.model('Vendor', VendorSchema);

module.exports = Vendor;
