const mongoose = require('mongoose');
const io = require('socket.io-client')
    , io_server = require('socket.io').listen(3001);
const User = require('../controllers/usersController')(io_server);
const Vendor = require('../controllers/vendorController');

const assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();

let Db = ' ';
let customerSocket;
let courierSocket;
let vendorSocket;

before(async () => {
    // Setup DB Before Test Begins
    mongoose.connect('MONGO_URI=mongodb://localhost:27017/chow-xpress-test', {
        useNewUrlParser: true,
        useFindAndModify: false,
    });

    // Connection Instance
    Db = mongoose.connection;
    Db.on('error', console.error.bind(console, 'MongoDB connection error'));
    Db.on('connected', console.log.bind(console, 'MongoDB connected'));

    // Setup socket io connection
    customerSocket = io.connect('http://localhost:3001/customer', {
        'reconnection delay': 0
        , 'reopen delay': 0
        , 'force new connection': true
        , transports: ['websocket']
    });
    customerSocket.on('connect', () => {
        console.log('Customer Connected');
    });

    courierSocket = io.connect('http://localhost:3001/courier', {
        'reconnection delay': 0
        , 'reopen delay': 0
        , 'force new connection': true
        , transports: ['websocket']
    });
    courierSocket.on('connect', () => {
        console.log('Courier Connected');
    });

    vendorSocket = io.connect('http://localhost:3001/vendor', {
        'reconnection delay': 0
        , 'reopen delay': 0
        , 'force new connection': true
        , transports: ['websocket']
    });
    vendorSocket.on('connect', () => {
        console.log('Vendor Connected');
    });

    customerSocket.on('orderError', args => {
        console.log(args);
    });

    customerSocket.on('associationError', args => {
        console.log(args);
    });

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
    await User.signUp(req);

    req = {
        body: {
            Name: 'Exceeding Grace',
            Password: '111',
            Location: 'Downtown',
            PhoneNo: 'xxx-xxx-xxx'
        }
    };
    await Vendor.signUp(req);

    req = {
        body: {
            email: 'furiousjoe16@gmail.com',
            password: '111',
        }
    };
    await User.login(req);

    req = {
        body: {
            name: 'Ade',
            phone_no: 'xxx-xxx-xxx',
        }
    };
    await User.registerCourier(req);

    req = {
        body: {
            name: 'Exceeding Grace'
        }
    };
    await User.vendorLogin(req);
});

after((done) => {
    Db.dropDatabase();
    // Clean Up
    if (vendorSocket.connected || courierSocket.connected || customerSocket.connected) {
        console.log('disconnecting...');

        vendorSocket.disconnect();
        courierSocket.disconnect();
        customerSocket.disconnect();

        console.log('disconnected')
    } else {
        // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
        console.log('no connection to break...');
    }
    done();
});

describe('WebSocket Connections', function (done) {
    it('should emit connected to customer socket', function () {
        customerSocket.emit("connected", {name: "Joseph Henshaw"});
    });

    it('should emit connected to courier socket', function () {
        courierSocket.emit('connected', {name: 'Ade'});
    });

    it('should emit connected to vendor socket', function () {
        vendorSocket.emit('connected', {name: 'Exceeding Grace'});
    });

    it('should place an order and receive the order over courier and vendor sockets', function (done) {
        const order = {
            items: {
                "jollof": 200,
                "plantain": 150,
                "beef": 250,
            },
            vendor: {
                name: 'Exceeding Grace'
            }
        };

        customerSocket.emit('order', order);
        customerSocket.on('order_Assigned', args => {
            console.log(args);
        });
        courierSocket.on('assigned_An_Order', args => {
            console.log(args);
            expect(args).to.not.be.empty;
        });
        vendorSocket.on('new_order', args => {
            console.log(args);
            expect(args).to.not.be.empty;
            args.should.have.property('message');
            done();
        });
    });

});
