const mongoose = require('mongoose');
const User = require('../controllers/usersController');

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

describe('User', async function() {
   it('Should create a new user and return a token', async function(){
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
   });

    it('should login users and return a json web token ', async function () {
        let req = {
            body: {
                Email: 'furiousjoe16@gmail.com',
                Password: '111',
            }
        };

        const token = await User.login(req);
        token.should.have.property('token');
    });
});
