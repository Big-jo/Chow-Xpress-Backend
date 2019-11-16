const mongoose = require('mongoose');
const User = require('../controllers/usersController');
const Vendor = require('../controllers/vendorController');

const expect = require('chai').expect;
const should = require('chai').should();

let Db = ' ';

before((done) => {
    // Setup DB Before Test Begins
    mongoose.connect('MONGO_URI=mongodb://localhost:27017/chow-xpress-test', {
        useNewUrlParser: true,
        useFindAndModify: false,
    });

    // Connection Instance
    Db = mongoose.connection;
    Db.on('error', console.error.bind(console, 'MongoDB connection error'));
    Db.on('connected', console.log.bind(console, 'MongoDB connected'));

    done();
});


after((done) => {
    Db.dropDatabase();
    done();
});


describe('User Controller', async function () {
    it('Should create a new user and return a token', async function () {
        let req = {
            body: {
                Name: 'Joseph Henshaw',
                Password: '111',
                Gender: 'Male',
                Hostel: 'Silver1',
                PhoneNo: 'xxxxxxxxx',
                Email: 'furiousjoe16@gmail.com'
            }
        };
        const token = await User.signUp(req);
        token.should.have.property('token');
        expect(token).not.be.empty;
    });

    it('should login users and return a json web token and emit connected over websocket', async function () {
        let req = {
            body: {
                email: 'furiousjoe16@gmail.com',
                password: '111',
            }
        };

        const token = await User.login(req);
        // token.should.have.property('token');
        expect(token).to.not.be.empty;

    });

    it('should register a courier and emit connected over socket', async function () {
        const req = {
            body: {
                name: 'Ade',
                phone_no: 'xxx-xxx-xxx',
            }
        };
        await User.registerCourier(req);

    });

    it('should sign up vendor and return token', async function () {
        const req = {
            body: {
                Name: 'Exceeding Grace',
                Password: '111',
                Location: 'Downtown',
                PhoneNo: 'xxx-xxx-xxx'
            }
        };
        const token = await Vendor.signUp(req);
        expect(token).to.not.be.empty;
    });

    it('should login a vendor and emit connected over socket', async function () {
        const req = {
            body: {
                name: 'Exceeding Grace'
            }
        };
        await User.vendorLogin(req);
    });

});



