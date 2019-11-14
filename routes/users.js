module.exports = function (io) {
  const {INTERNAL_SERVER_ERROR, OK} = require("http-status-codes");
  const {Router} = require('express');
  const User = require('../controllers/usersController.js')(io);


  const router = Router();
  const error = 'Oops an error occurred';
  /* Register a new user */
  router.post('/signup', async function (req, res) {
    try {
      const token = await User.signUp(req);

      res.status(OK).json({
        token,
      })
    } catch (e) {
      console.log(e);
      res.status(INTERNAL_SERVER_ERROR).json({
        error: 'Oops an error occurred',
      });
    }
  });

  // Login a user
  router.post('/login', async function (req, res) {
    try {
      const token = await User.login(req);

      res.status(OK).json({
        token,
      })
    } catch (e) {
      console.log(e);
      res.status(INTERNAL_SERVER_ERROR).json({
        error: 'Oops an error occurred',
      })
    }
  });

  router.post('/registerCourier', async (req, res) => {
    try {
      await User.registerCourier(req);

      res.status(OK).json({
        status: 'Registered'
      })
    } catch (e) {
      res.status(INTERNAL_SERVER_ERROR).json({
        error,
      })
    }
  });
  return router;
};

// module.exports = router;
