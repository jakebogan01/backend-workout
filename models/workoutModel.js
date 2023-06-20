// Initialize mongoose
const mongoose = require("mongoose");

// Create a schema
const Schema = mongoose.Schema;

// Create a workout schema
const workoutSchema = new Schema(
     {
          title: {
               type: String,
               required: [true, "Title is required"],
               unique: [true, "Title already exists"],
          },
          slug: {
               type: String,
               required: [true, "Slug is required"],
               unique: [true, "Slug already exists"],
          },
          reps: {
               type: Number,
               required: [true, "Reps is required"],
          },
          load: {
               type: Number,
               required: [true, "Load is required"],
          },
          user_id: {
               type: String,
               required: true,
          }
     },
     { timestamps: true }
);

// Create a model
module.exports = mongoose.model("Workout", workoutSchema);
