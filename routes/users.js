const  {INTERNAL_SERVER_ERROR, OK} = require("http-status-codes");
const {Router} = require('express');
const User = require('../controllers/usersController.js');
const {logger} = require("../shared/Logger");

const router = Router();

/* Register a new user */
router.post('/signup', function(req, res) {
  try {
    const token = User.SignUp(req);

    res.status(OK).json({
      token,
    })
  } catch (e) {
    logger.error('error', e);
    res.status(INTERNAL_SERVER_ERROR).json({
      error: 'Oops an error occurred',
    });
  }
});

module.exports = router;
