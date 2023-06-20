// Initialize mongoose
const mongoose = require("mongoose");
// Import bcryptjs
const bcrypt = require("bcrypt");
// Import validator
const validator = require("validator");

// Create a schema
const Schema = mongoose.Schema;

// Create a user schema
const userSchema = new Schema(
     {
          email: {
               type: String,
               required: [true, "Email is required"],
               unique: [true, "Email already exists"],
          },
          password: {
               type: String,
               required: [true, "Password is required"],
          },
     },
     { timestamps: true }
);

// Create a static method for signup
// this key word does not work with arrow functions
userSchema.statics.signup = async function(email, password) {

     // validation
     if (!email || !password) {
          throw new Error("All fields must be provided");
     }
     // check if email is valid
     if (!validator.isEmail(email)) {
          throw new Error("Email is invalid");
     }
     // check if password is strong enough
     if (!validator.isStrongPassword(password)) {
          throw new Error("Password is not strong enough");
     }

     // Check if email exists
     const exists = await this.findOne({ email });
     if (exists) {
          throw new Error("Email already in use");
     }

     // Hash the password
     const salt = await bcrypt.genSalt(15);
     const hash = await bcrypt.hash(password, salt);

     // Create a new user
     const user = await this.create({ email, password: hash });

     return user;
};

// Create a static method for login
userSchema.statics.login = async function(email, password) {
     // validation
     if (!email || !password) {
          throw new Error("All fields must be provided");
     }

     // Check if email exists
     const user = await this.findOne({ email });
     if (!user) {
          throw new Error("Incorrect email");
     }

     // Check if password is a match with the hashed password
     const match = await bcrypt.compare(password, user.password);
     if (!match) {
          throw new Error("Incorrect password");
     }

     return user;
};

// Create a model
module.exports = mongoose.model("User", userSchema);
