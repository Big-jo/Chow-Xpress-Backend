// const VendorModel = require('../models/vendorModel');

class Vendor {
    constructor(name, location, phoneNo, Items) {
        this.name = name;
        this.location = location;
        this.phoneNo = phoneNo;
        this.Items = Items;
        this.socketID = '';
    }

    // async ChangeItemStatus(itemID, state) {
    //     await VendorModel.findByIdAndUpdate()
    // }
}

module.exports = Vendor;
