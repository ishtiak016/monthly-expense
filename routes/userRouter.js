const express = require("express");
const userRouter = express.Router();
const {
  loginController,
  registerController,
} = require("../controllers/userController");

// User login
userRouter.post("/login", loginController);

// User registration
userRouter.post("/register", registerController);

module.exports = userRouter;
