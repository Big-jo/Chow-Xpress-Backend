import jwt from "jsonwebtoken";

const logger = require("nodemon/lib/utils");
const {INTERNAL_SERVER_ERROR, UNAUTHORIZED} = require("http-status-codes");


function Authenticate(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    let result;

    if(authorizationHeader) {
        const token = authorizationHeader.split(' ');
        try {
            const secret = process.env.JWT_SECRET;
            result = jwt.verify(token, secret);
            req.token = result;

            next();
        } catch (e) {
        //    TODO: Setup a logger
            logger.log(e);
            res.status(INTERNAL_SERVER_ERROR).json({
                error: 'An error occurred',
            });
        }
    } else {
        res.status(UNAUTHORIZED).json({
            error: 'You are not authorized',
        });
    }
}

module.exports.Authenticate = Authenticate;
