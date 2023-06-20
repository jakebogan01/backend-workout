// Import the workout model
const Workout = require("../models/workoutModel");
// Import mongoose
const mongoose = require("mongoose");

// GET all workouts
const getAllWorkouts = async (req, res) => {
     // get the user id from the request
     const user_id = req.user._id;

     // get all workouts from the database created by logged in user and sort by createdAt date in descending order
     const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 });

     try {
          // send back the workouts
          res.status(200).json(workouts);
     } catch (error) {
          // send back the error
          res.status(400).json({ error });
     }
};

// GET a single workout
const getSingleWorkout = async (req, res) => {
     // get the slug from the request parameters
     const { slug } = req.params;

     // find the workout in the database
     const workout = await Workout.find({ slug: slug });

     // if the workout is not found
     if (!workout || workout.length === 0) {
          return res.status(404).json({ error: "Workout not found" });
     }

     // send back the workout
     res.status(200).json({ workout });
};

// CREATE a new workout
const createWorkout = async (req, res) => {
     // get the title, reps, and load from the request body
     const { title, slug, reps, load } = req.body;

     let emptyFields = [];

     if (!title) {
          emptyFields.push("title");
     }
     if (!reps) {
          emptyFields.push("reps");
     }
     if (!load) {
          emptyFields.push("load");
     }
     if (emptyFields.length > 0) {
          return res.status(400).json({ error: 'Please fill in all the fields', emptyFields });
     }

     try {
          // get the user id from the request
          const user_id = req.user._id;

          // check if the workout already exists by slug
          const existingWorkout = await Workout.find({ slug: slug });

          // if the workout already exists
          if (existingWorkout.length > 0) {
               return res.status(400).json({ error: "Workout already exists" });
          }
          // create a new workout
          const workout = await Workout.create({ title, slug, reps, load, user_id });
          // send back the new workout
          res.status(200).json({ workout });
     } catch (error) {
          // send back the error
          res.status(400).json({ error });
     }
};

// DELETE a new workout
const deleteWorkout = async (req, res) => {
     // use to check if the id is valid
     const { id } = req.params;

     // if the workout is not found
     if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(404).json({ error: "Workout not found" });
     }

     // find the workout in the database
     const workout = await Workout.findOneAndDelete({ _id: id });

     // if the workout is not found
     if (!workout) {
          return res.status(404).json({ error: "Workout not found" });
     }

     // send back the workout
     res.status(200).json({ message: "Workout deleted successfully" });
};

// UPDATE a workout
const updateWorkout = async (req, res) => {
     // use to check if the id is valid
     const { id } = req.params;

     // if the workout is not found
     if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(404).json({ error: "Workout not found" });
     }

     // find the workout in the database
     const workout = await Workout.findOneAndUpdate(
          { _id: id },
          {
               ...req.body,
          }
     );

     // if the workout is not found
     if (!workout) {
          return res.status(404).json({ error: "Workout not found" });
     }

     res.status(200).json({ message: "Workout updated successfully" });
};

// export the controller
module.exports = {
     getAllWorkouts,
     getSingleWorkout,
     createWorkout,
     deleteWorkout,
     updateWorkout,
};
