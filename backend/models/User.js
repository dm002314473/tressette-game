const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  stats: {
    totalWins: { type: Number, required: true },
    win1v1: { type: Number, required: true },
    win2v2: { type: Number, required: true },
    winPercentage: { type: Number, required: true },
    played: { type: Number, required: true },
  },
  resetPasswordToken: String, // Token for password reset
  resetPasswordExpires: Date, // Expiration date for the reset token
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
