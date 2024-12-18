const express = require("express");
const { LoginUser, RegisterUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);

module.exports = router;
