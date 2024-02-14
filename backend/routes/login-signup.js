const express = require("express");

const router = express.Router();
const {postLogIn, postSignUp} = require("../controllers/login-signup");

router.post("/signup", postSignUp);
router.post("/login", postLogIn);

module.exports = router;
