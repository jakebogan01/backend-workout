// Initialize express router
const express = require("express");
// Import the workout controller
const { createWorkout, getSingleWorkout, getAllWorkouts, deleteWorkout, updateWorkout } = require("../controllers/workoutController");
// Import the requireAuth middleware
const requireAuth = require("../middleware/requireAuth");
// express app
const router = express.Router();
// use requireAuth middleware for all routes
router.use(requireAuth);

// GET all workouts
router.get("/", getAllWorkouts);

// GET a single workout
router.get("/:slug", getSingleWorkout);

// CREATE a new workout
router.post("/", createWorkout);

// DELETE a new workout
router.delete("/:id", deleteWorkout);

// UPDATE a workout
router.patch("/:id", updateWorkout);

// export the router
module.exports = router;
