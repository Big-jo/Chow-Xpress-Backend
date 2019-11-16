const VendorModel = require('../models/vendorModel');
const bcrypt = require('bcrypt');
const CreateToken = require("../lib/jsonWebToken");

/**
 *
 * @returns {*}
 * Vendor Controller
 */

Vendor = () => {
    this.signUp = async function (req) {
        try {
            const Vendor = await VendorModel.findOne({"Name": req.body.Name});
            if (Vendor !== null) {
                return 'Oops this User already'
            } else {
                const Vendor = {
                    Name: req.body.Name,
                    Password: req.body.Password,
                    Location: req.body.Location,
                    PhoneNo: req.body.PhoneNo
                };
                const vendor = await new VendorModel(Vendor);
                const saltRounds = 10;
                vendor.Password = await bcrypt.hash(vendor.Password, saltRounds);
                await vendor.save();

                return await CreateToken(vendor);
            }
        } catch (e) {
            throw new Error(e);
        }
    };

    this.addItem = async (req) => {
        try {
            await VendorModel.findOneAndUpdate({"Name": req.body.name}, {$push: {Items: req.body.item}}).exec();
        } catch (e) {
            throw new Error(e);
        }
    };
    // this.login = async (req) => {
    //         try {
    //             const Vendor = await VendorModel.findOne({email: req.body.email});
    //
    //             if (Vendor) {
    //                 const vendorPassword = Vendor.Password;
    //                 const requestPassword = req.body.Password;
    //                 const samePassword = await bcrypt.compare(requestPassword, vendorPassword);
    //
    //                 if(samePassword) {
    //                     const token = await CreateToken(Vendor);
    //                     return {token}
    //                 } else {
    //                     return 'Sorry, this does not match what we have';
    //                 }
    //             }
    //         } catch (e) {
    //             throw new Error (e);
    //         }
    //     };

    return this;
};

module.exports = Vendor();
// FIXME: use standard node.js imports throughout all modules.
