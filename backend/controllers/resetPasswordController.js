const User = require("../models/User");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dominkomilic@gmail.com", //change to tressetta mail
    pass: "muap jjty chlt tpns", // app password for Gmail
  },
});

const generateToken = (email) => {
  const payload = { email };
  const secretKey = process.env.JWT_SECRET_KEY;
  const options = { expiresIn: "1h" };

  const token = jwt.sign(payload, secretKey, options);
  return token;
};

const sendResetPasswordEmail = (email, resetLink) => {
  const mailOptions = {
    from: "dominkomilic@gmail.com", //change to tressetta mail
    to: email,
    subject: "Password Reset Request",
    text: `Click the following link to reset your password: ${resetLink}`,
  };

  return transporter.sendMail(mailOptions);
};

const ResetPassword = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  const user = await User.findOne({ email });

  console.log("pronadeni user: ", user);

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "User with given email doesn't exist" });
  }

  const token = generateToken(email);

  const resetLink = `http://localhost:3000/reset-password?email=${email}&token=${token}`;

  user.resetPasswordToken = token;

  const tokenExpirationTime = 1 * 60 * 60 * 1000;
  user.resetPasswordExpires = Date.now() + tokenExpirationTime;

  await user.save();

  try {
    await sendResetPasswordEmail(email, resetLink);
    res
      .status(200)
      .json({ success: true, message: "Password reset email sent." });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send reset email" });
  }
};

const EnterNewPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  console.log("email: ", email, "token: ", token, "newPassword: ", newPassword);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (
      user.resetPasswordToken !== token ||
      user.resetPasswordExpires < Date.now()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token." });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { ResetPassword, EnterNewPassword };
