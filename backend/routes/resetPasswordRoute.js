const express = require("express");
const {
  ResetPassword,
  EnterNewPassword,
} = require("../controllers/resetPasswordController");

const router = express.Router();

router.get("/:email", ResetPassword);
router.post("/update", EnterNewPassword);

module.exports = router;
