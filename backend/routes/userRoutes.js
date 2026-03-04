const express = require("express");
const router = express.Router();

const { createUser, getUsers, loginUser, followUser, getProfile, forgotPassword, resetPassword, searchUsers, updateProfile } = require("../controllers/userController");

router.post("/", createUser);
router.get("/", getUsers);
router.post("/login", loginUser);
router.post("/follow", followUser);
router.get("/profile/:userId", getProfile);
router.get("/forgot-password", (req, res) => {
    res.send("<h1>🔒 Secure Vault Gateway</h1><p>This is a secure API endpoint for password resets. Please use the <b>InstaVibe</b> frontend interface to request a reset link.</p>");
});
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/search", searchUsers);
router.put("/profile/:userId", updateProfile);

module.exports = router;
