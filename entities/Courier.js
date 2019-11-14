module.exports = class Courier {
    constructor(name, phone_no) {
        this.name = name;
        this.phone_no = phone_no;
        this.socketID = '';
        this.basket = []; // Holds orders from customers
    }

    AddOrder(order) {
        this.basket.push(order);
    }
};
