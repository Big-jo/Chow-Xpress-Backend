const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const {CreateToken} = require("../lib/jsonWebToken");


/**
 *
 * @returns {*}
 * User Controller
 */
   const User = async () => {

    /**
     * @return {string} Returns a json web token
     * 
     */
    this.signUp = async function (req) {
    //  Check if user is already available
        const User = await UserModel.findOne({"email": req.body.email});
        if (User) {
            return 'Oops this User already'
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
                const token = await CreateToken(user);
                return {token};
            } catch (e) {
                throw e;
            }
        }
    };

    /**
     *
     * @return {string | object} A json web token
     */
    this.login = async function (req) {
        try {
            const User = await UserModel.findOne({email: req.body.email});

            if (User) {
                const userPassword = User.Password;
                const requestPassword = req.body.Password;
                const samePassword = await bcrypt.compare(requestPassword, userPassword);

                if(samePassword) {
                   const token = await CreateToken(User);
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
   exports.User = User();
