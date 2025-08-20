const authService = require("../services/auth-service");

const register = async (req, res) => {
  try {
    console.log("going in 1");
    const { email, password, name } = req.body;
    const user = await authService.registerUser(email, password, name);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    res.status(201).json({ message: "User login successful", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login };
