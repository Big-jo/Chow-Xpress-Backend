const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const CreateToken = require("../lib/jsonWebToken");
const Customer = require('../entities/Customer');
const Courier = require('../entities/Courier');
const logger = require("nodemon/lib/utils");
const EventEmitter = require('events');

/**
 *
 * @returns {*}
 * User Controller
 */
module.exports = User = (io) => {
    const loggedInCustomers = [];
    const availableCouriers = [];
    const emitter = new EventEmitter();

    /**
     * @return {string} Returns a json web token
     */
    this.signUp = async function (req) {
        //  Check if user is already available
        try {
            const User = await UserModel.findOne({"email": req.body.email});
            if (User !== null) {
                return 'Oops this User already exists'
            } else {
                try {
                    const User = {
                        Name: req.body.Name,
                        Password: req.body.Password,
                        Gender: req.body.Gender,
                        Hostel: req.body.Hostel,
                        PhoneNo: req.body.PhoneNo,
                        Email: req.body.Email,
                    };
                    const user = await new UserModel(User);
                    const saltRounds = 10;
                    user.Password = await bcrypt.hash(User.Password, saltRounds);
                    user.save();
                    console.log(user);
                    const token = await CreateToken(user);
                    return {token};
                } catch (e) {
                    throw e;
                }
            }
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    };

    /**
     *
     * @return {string | object} A json web token
     */
    this.login = async function (req) {
        try {
            const User = await UserModel.findOne({Email: req.body.email});
            if (User !== null) {
                const userPassword = User.Password;
                const requestPassword = req.body.password;
                const samePassword = await bcrypt.compare(requestPassword, userPassword);

                if (samePassword) {
                    const token = await CreateToken(User);
                    const customer = new Customer(User.Name, User.Gender, User.Hostel, User.PhoneNo);
                    loggedInCustomers.push(customer);
                    return token;
                } else {
                    return 'Sorry, login info is incorrect ';
                }
            } else {
                return 'Sorry this user does not exist'
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    };

    this.registerCourier = async (req) => {
        const courier = new Courier(req.body.name, req.body.phone_no);
        availableCouriers.push(courier);
    };

    /**
     * Creates an new order object and assigns it to a courier, then emits the courier and order
     * back to the customer.
     * @param _order - A list of things to get from a vendor
     * @param socketID - socketID of client making the order
     */
    function Order(_order, socketID) {
        //  Find the user in list of logged in users using their socketID
        const customer = findEntity('socketID', socketID, loggedInCustomers);
        if (customer) {
            const order = customer.Order({
                items: _order.items,
                vendor: _order.vendor,
            });
            // Assign this order to a courier
            const courier = AssignCourier(order);
            emitter.emit('order_Assigned', {emittedData: socketID, courier, order});
            // Emit to courier that they've received an order
            emitter.emit('assigned_An_Order', {courierSID: courier.socketID, order});
        } else {
            throw new Error('Customer not logged in');
        }
    }

    /**
     * Finds a courier and assigns an order to them.
     * @param order {object} - An Object order
     */
    function AssignCourier(order) {
        try {
            const courier = availableCouriers.pop();
            courier.AddOrder(order);
            return {name: courier.name, phoneNo: courier.phone_no, socketID: courier.socketID};
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /************************************************************************************
     *                           SOCKET CONNECTIONS
     * @type {ParentNamespace|Buffer|SocketIO.Namespace|Chai.Assertion|Uint32Array|BigInt64Array|Int8Array|BigUint64Array|string[]|Int32Array|Uint8ClampedArray|Uint8Array|Int16Array|Float64Array|Float32Array|Uint16Array}
     *
     ************************************************************************************/


    /**************************************************************************************
     *                          CUSTOMER SOCKET CONNECTIONS
     * @type {ParentNamespace|Buffer|SocketIO.Namespace|Chai.Assertion|Uint32Array|BigInt64Array|Int8Array|BigUint64Array|string[]|Int32Array|Uint8ClampedArray|Uint8Array|Int16Array|Float64Array|Float32Array|Uint16Array}
     ****************************************************************************************/

    const customerSocket = io.of('/');
    customerSocket.on('connection', socket => {
        // TODO: Emit an error if the user is not found in list of logged in, just as a precaution
        socket.on('connected', (data) => {
            let foundCustomer = findEntity('name', data.name, loggedInCustomers);
            foundCustomer.socketID = socket.id;
        });
        socket.on('order', (data) => {
            try {
                Order(data, socket.id);
            } catch (e) {
                console.log(e);
                socket.emit('orderError', 'Oops an error occurred while placing your order');
            }
        });
    });

    // Emit to particular socket
    emitter.on('order_Assigned', args => {
        customerSocket.sockets[args.emittedData].emit('order_Assigned', {courierInfo: args.courier});
    });
    // Emit error to particular socket
    emitter.on('error', args => {
        customerSocket.sockets[args.socketID].emit('Assigned', {courierInfo: args.courier})
    });

    /*********************************************************************************************
     *                                      COURIER SOCKET CONNECTIONS
     * @type {ParentNamespace|Buffer|SocketIO.Namespace|Chai.Assertion|Uint32Array|BigInt64Array|Int8Array|BigUint64Array|string[]|Int32Array|Uint8ClampedArray|Uint8Array|Int16Array|Float64Array|Float32Array|Uint16Array}
     **********************************************************************************************/

    const courierSocket = io.of('/courier');
    courierSocket.on('connection', socket => {
        //    Find loggedIn courier and assign them a socketID
        socket.on('connected', args => {
            const foundCourier = findEntity('name', args.name, availableCouriers);
            foundCourier.socketID = socket.id;
        });
    });

    //Notify a courier that they've been assigned an order and send order
    emitter.on('assigned_An_Order', args => {
        courierSocket.sockets[args.courierSID].emit('got_Assigned', args.order);
    });


    // TODO: Create a socket for a vendor, so they can receive a notification when an order has been placed

    // Utility Functions

    function findEntity(key, value, array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i][key] === value) return array[i];
        }
    }

    return this;
//       TODO: Implement a logger
};
// exports.User = User;
