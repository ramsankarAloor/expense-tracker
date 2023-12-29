const express = require('express');

const router = express.Router();
const loginSignupController = require('../controllers/login-signup');

router.post('/signup', loginSignupController.postSignUp);
router.post('/login', loginSignupController.postLogIn);

module.exports = router;