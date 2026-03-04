const express = require("express");
const router = express.Router();
const {
    createPost,
    getFeed,
    updateTagStatus,
    getPendingTags,
    likePost,
    unlikePost,
    addComment,
    getStories,
    deletePost,
    updatePost
} = require("../controllers/postController");
const upload = require("../utils/upload");

router.post("/create", upload.single('image'), createPost);
router.get("/feed", getFeed);
router.get("/stories/:userId", getStories);
router.patch("/:postId/tag", updateTagStatus);
router.get("/tags/pending/:userId", getPendingTags);
router.post("/:postId/like", likePost);
router.post("/:postId/unlike", unlikePost);
router.post("/:postId/comment", addComment);
router.delete("/:postId", deletePost);
router.patch("/:postId", updatePost);

module.exports = router;
