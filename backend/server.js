
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const path = require("path");
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(cors());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use("/uploads", express.static(uploadDir));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.use((err, req, res, next) => {
    console.error("====== GLOBAL ERROR ======");
    console.error(err.message || err);
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error", details: err.message || JSON.stringify(err) });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
