// Purpose: server for the backend

// Load environment variables
const dotenv = require("dotenv");
// Initialize express
const express = require("express");
// Initialize mongoose
const mongoose = require("mongoose");
// Initialize multer
const multer = require("multer");
// Initialize path
const path = require("path");
// Import routes
const workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/user");
// express app
const app = express();
app.use('/images', express.static('images'));
dotenv.config();

// cors
const cors = require("cors");
app.use(
     cors({
          origin: "*",
     })
);

// middleware
// image storage
const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, 'images');
     },
     filename: (req, file, cb) => {
          console.log(file);
          cb(null, Date.now() + path.extname(file.originalname));
     }
});
// filter image extensions
const fileFilter = (req, file, cb) => {
     if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
          cb(null, true);
     } else {
          cb(null, false);
     }
}
const upload=multer({
     storage: storage,
     limits: {
          fileSize:1024*1024*5
     },
     fileFilter: fileFilter
});
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
// upload image
app.post("/api/upload", upload.single("image"), (req, res) => {
     if (!req.file) {
          return res.status(400).send("you didn't upload image (jpeg OR png)")
     }
     return res.send({message: 'Image has been uploaded!', image: req.file.filename});
});
// retrieve image
app.get("/api/images/:image", (req, res) => {
     res.sendFile(path.join(__dirname, "images", req.params.image));
});

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
