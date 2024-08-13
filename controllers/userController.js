const userModel = require("../models/userModel");

// User login controller
const loginController = async (req, res) => {
  console.log("Login request received:", req.body);  // Log the request body
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await userModel.findOne({ email, password });
    console.log('User found:', user);  // Log the user found
    if (!user) {
      return res.status(400).json({ message: "Login fail" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error in loginController:', error);  // Log the error
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// User registration controller
const registerController = async (req, res) => {
  try {
    const newUser = new userModel(req.body); // Create a new instance of userModel
    const savedUser = await newUser.save();
    res.status(200).json({
      success: true,
      user: savedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

module.exports = { loginController, registerController };
