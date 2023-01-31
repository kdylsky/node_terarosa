const express = require("express");
const router = express.Router();
const {
  signupValidation,
  loginValidation,
} = require("../middlewares/joi_middleware");
const wrapAsync = require("../utils/wrapAsync");
const users = require("../controllers/users");

router.post("/signup", signupValidation, wrapAsync(users.signupUser));
router.post("/login", loginValidation, wrapAsync(users.loginUser));

module.exports = router;
