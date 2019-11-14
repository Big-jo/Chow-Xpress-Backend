const Customer = require('../entities/Customer');

const assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();


describe('Customer', function () {
    it('should create a customer object', function () {
        const customer = new Customer('Joseph Henshaw', 'Male', 'Silver1', '08180286155', '0011');
        customer.should.be.an('object');
    });
    it('should order items from a vendor and return an order', function () {
        const customer = new Customer('Joseph Henshaw', 'Male', 'Silver1', '08180286155', '0011');
        const orderRequest = {
            items: {
                'jollof': 200,
                'plantain': 150,
                'beef': 250,
            },
            vendor: {
                name: 'Exceeding Grace'
            }
        };
        const order = customer.Order(orderRequest);
        order.should.be.an('object');
        order.should.have.property('customer');
        order.should.have.property('items');
        order.should.have.property('vendor');
        order.should.have.property('total');
    });
});
