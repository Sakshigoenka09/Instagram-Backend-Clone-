
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const path = require("path");
const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

module.exports = app;
