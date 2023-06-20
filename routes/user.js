// Initialize express router
const express = require("express");
// Import user controller
const { getAllUsers, deleteUser, loginUser, signupUser } = require("../controllers/userController");
// express app
const router = express.Router();

// GET all users
router.get("/", getAllUsers);

// GET all users
router.delete("/:id", deleteUser);

// LOGIN user
router.post("/login", loginUser);

// SIGNUP user
router.post("/signup", signupUser);

module.exports = router;