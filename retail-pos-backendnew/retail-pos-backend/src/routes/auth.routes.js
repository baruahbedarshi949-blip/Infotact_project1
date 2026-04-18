
const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");

// LOGIN ROUTE
router.post("/login", controller.login);

module.exports = router;
// const express = require('express');
// const router = express.Router();
// const controller = require('../controllers/auth.controller');
// const { protect } = require('../middlewares/auth.middleware');

// router.post('/register', controller.register);
// router.post('/login', controller.login);
// router.get('/me', protect, controller.me);

// module.exports = router;
