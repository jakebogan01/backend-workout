// Import the user model
const User = require("../models/userModel");
// Import mongoose
const mongoose = require("mongoose");
// Import jsonwebtoken
const jwt = require("jsonwebtoken");

// create token
const createToken = (_id) => {
     return jwt.sign({ _id: _id }, process.env.TOKEN_SECRET, {
          expiresIn: "3d",
     });
};

// get all users
const getAllUsers = async (req, res) => {
     // get all users from the database and sort by createdAt date in descending order
     const users = await User.find({}).sort({ createdAt: -1 });

     try {
          // send back the users
          res.status(200).json(users);
     } catch (error) {
          // send back the error
          res.status(400).json({ error });
     }
};

// DELETE a new user
const deleteUser = async (req, res) => {
     // use to check if the id is valid
     const { id } = req.params;

     // if the user is not found
     if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(404).json({ error: "User not found" });
     }

     // find the user in the database
     const user = await User.findOneAndDelete({ _id: id });

     // if the user is not found
     if (!user) {
          return res.status(404).json({ error: "User not found" });
     }

     // send back the user
     res.status(200).json({ message: "User deleted successfully" });
};

// login user
const loginUser = async (req, res) => {
     const { email, password } = req.body;

     try {
          // Login the user
          const user = await User.login(email, password);
          // Create a token
          const token = createToken(user._id);
          // Send back the user email and token
          res.status(200).json({ email, token });
     } catch (error) {
          // Send back the error
          res.status(400).json({ error: error.message });
     }
}

// signup user
const signupUser = async (req, res) => {
     // Get email and password from req.body
     const { email, password } = req.body;

     try {
          // Create a new user
          const user = await User.signup(email, password);
          // Create a token
          const token = createToken(user._id);
          // Send back the user email and token
          res.status(200).json({ email, token });
     } catch (error) {
          // Send back the error
          res.status(400).json({ error: error.message });
     }
}


// export controllers
module.exports = { getAllUsers, deleteUser, loginUser, signupUser };