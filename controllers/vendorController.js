const VendorModel = require('../models/vendorModel');
const bcrypt = require('bcrypt');
const {CreateToken} = require("../lib/jsonWebToken");


const Vendor = async() => {
    this.signUp = async (req) => {
        const Vendor = await VendorModel.findOne({"email": req.body.email});
        if (Vendor) {
            return 'Oops this User already'
        } else {
            try {
                const Vendor = {
                    Name: req.body.Name,
                    Password: req.body.Password,
                    Location: req.body.Location,
                    PhoneNo: req.body.PhoneNo
                };
                const vendor = await new VendorModel(Vendor);
                const saltRounds = 10;
                vendor.Password = await bcrypt.hash(vendor.Password, saltRounds);
                vendor.save();
                const token = CreateToken(vendor);

                return {token};
            } catch (e) {
                throw e;
            }
        }
    };

    this.login = async (req) => {
            try {
                const Vendor = await VendorModel.findOne({email: req.body.email});

                if (Vendor) {
                    const vendorPassword = Vendor.Password;
                    const requestPassword = req.body.Password;
                    const samePassword = await bcrypt.compare(requestPassword, vendorPassword);

                    if(samePassword) {
                        const token = await CreateToken(Vendor);
                        return {token}
                    } else {
                        return 'Sorry, this does not match what we have';
                    }
                }
            } catch (e) {
                throw e;
            }
        };

    return this;
};

exports.vendor = Vendor();
// FIXME: use standard node.js imports throughout all modules.
