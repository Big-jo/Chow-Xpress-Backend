const mongoose = require('mongoose');
const Vendor = require('../controllers/vendorController');

const assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();

let Db = ' ';
before(() => {
//    Setup DB Before Test Begins
    mongoose.connect('MONGO_URI=mongodb://localhost:27017/chow-xpress', {
        useNewUrlParser: true,
        useFindAndModify: false,
    });
// Connection Instance
    Db = mongoose.connection;
    Db.on('error', console.error.bind(console, 'MongoDB connection error'));
    Db.on('connected', console.log.bind(console, 'MongoDB connected'));
});


after(()=> {
    Db.dropDatabase();
});

describe('Register Vendor', async function() {
    it('Should create a new vendor and return a token', async function(){
        let req = {
            body: {
                Name: 'Xceeding',
                Password: '111',
                Location: 'Downtown',
                Phone: 'xxx-xxx-xxx',
            }
        };
        const token = await Vendor.signUp(req);

        token.should.have.property('token');
    });

    it('should login a vendor and return a json web token ', async function () {
        let req = {
            body: {
                Name: 'Xceeding',
                Password: '111',
            }
        };

        const token = await Vendor.login(req);
        token.should.have.property('token');
    });
});
