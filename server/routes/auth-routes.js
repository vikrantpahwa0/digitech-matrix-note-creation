const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const {validateUser,validateUserLogin} = require("../middlewares/validate-user");

router.post("/register",validateUser, authController.register);
router.post("/login",validateUserLogin, authController.login);

module.exports = router;