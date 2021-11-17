const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv").config();
const path = require("path");

const app = express();

const authRoute = require("./routes/auth").default;
const userRoute = require("./routes/users").default;
const postRoute = require("./routes/posts").default;
const categoryRoute = require("./routes/categories");

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

//setup mongoose
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
});
var db = mongoose.connection;
db.once("open", function () {
  console.log("mongoose connected successfully");
});
db.on("error", function (error) {
  console.log(error);
});

// multer middelware
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
// Upload image
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
