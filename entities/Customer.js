class Customer {
    constructor(name, gender, hostel, phone_no, socketID) {
        this.name = name;
        this.gender = gender;
        this.hostel = hostel;
        this.phone_no = phone_no;
        this.socketID = '';
    }

    /**
     *  Return an object that contains the customers' order and sum total of the order;
     *  @param order {object} - An object that contains the Items the user want's and the vendor to purchase from
     *  @return {object}
     */

    Order(order) {
        const items = order.items;
        const vendor = order.vendor;
        const customer = {
            name: this.name,
            hostel: this.hostel,
        };

        return {
            customer,
            items,
            vendor: vendor.name,
            total: CalculateOrder(items),
        };

        /**
         *
         * @param items {Object} - A object that consist of items an their prices
         * @return {number} - Sum total of all the items
         */
        function CalculateOrder(items) {
            let previousItemPrice = 0;
            let courierCharge = 50;
            let total;
            for (const item in items) {
                if (!items.hasOwnProperty(item)) continue;

                previousItemPrice = items[item] + previousItemPrice;
            }
            total = previousItemPrice + courierCharge;

            return total;
        }

        // function Pay(){}
    }
}

module.exports = Customer;
