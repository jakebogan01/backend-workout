// Purpose: server for the backend

// Load environment variables
const dotenv = require("dotenv");
// Initialize express
const express = require("express");
// Initialize mongoose
const mongoose = require("mongoose");
// Import routes
const workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/user");
// express app
const app = express();
dotenv.config();

// cors
const cors = require("cors");
app.use(
     cors({
          origin: "*",
     })
);

// middleware
// this will parse the request body and add it to req.body
app.use(express.json());
app.use((req, res, next) => {
     // logs the request
     console.log(req.path, req.method);
     // next is a function that will be called after the middleware is done
     // if we don't call next, the request will be stuck
     next();
});

// routes
app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);

// connect to mongodb to database
mongoose
     .connect(process.env.MONGO_URI)
     .then(() => {
          // listen for requests
          app.listen(process.env.PORT, () => {
               console.log(`Connected to database and listening on port, ${process.env.PORT}`);
          });
     })
     .catch((error) => {
          console.log(error);
     });
