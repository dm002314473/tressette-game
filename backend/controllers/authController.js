const User = require("../models/User");
const { validateEmail } = require("../utils/validateInput");

// User registration
const RegisterUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if all fields are entered
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Sva polja su obavezna." });
    }

    // Check if email format is valid
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ message: "E-mail nije ispravnog formata." });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Korisnik s tim emailom već postoji." });
    }

    const user = new User({ username, email, password });
    await user.save();

    return res
      .status(201)
      .json({ message: "Registracija uspješna.", user: user.email });
  } catch (error) {
    console.error("Greška pri registraciji: ", error);
    return res.status(500).json({ message: "Greška na serveru." });
  }
};

// User login
const LoginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password fields are empty
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Molimo unesite e-mail i lozinku." });
    }

    // Check if user with specific username exists in database
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Korisnik ne postoji. Registrirajte se." });
    }

    // Check if username and password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Pogrešna lozinka." });
    }

    return res
      .status(200)
      .json({ message: "Prijava uspješna.", user: user.username });
  } catch (error) {
    console.error("Greška prilikom prijave: ", error);
    return res.status(500).json({ message: "Greška na serveru." });
  }
};

module.exports = { RegisterUser, LoginUser };
