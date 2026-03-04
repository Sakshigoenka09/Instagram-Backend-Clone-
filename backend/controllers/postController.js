const Post = require("../models/postModel");
const User = require("../models/userModel");

const createPost = async (req, res) => {
    try {
        const { caption, userId, tags } = req.body;
        // The image now comes from multer in req.file
        if (!req.file || !userId) {
            return res.status(400).json({ error: "Image file and User ID are required" });
        }

        const imagePath = `http://localhost:5000/uploads/${req.file.filename}`;

        // Parse tags if they are sent as a string (which sometimes happens with FormData)
        let parsedTags = [];
        if (tags) {
            parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
        }

        const formattedTags = parsedTags.map(id => ({ user: id, status: "pending" }));

        const post = await Post.create({
            user: userId,
            caption,
            image: imagePath,
            tags: formattedTags
        });

        return res.status(201).json(post);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong while creating the post" });
    }
};

const updateTagStatus = async (req, res) => {
    try {
        const { postId } = req.params;
        const { status, userId } = req.body; // status is 'approved' or 'rejected'

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const post = await Post.findOneAndUpdate(
            { _id: postId, "tags.user": userId },
            { $set: { "tags.$.status": status } },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ error: "Post or tag request not found" });
        }

        return res.status(200).json({ message: `Tag ${status} successfully`, post });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const getFeed = async (req, res) => {
    try {
        const { userId } = req.query; // Optional: filter feed by following
        let query = {};

        if (userId) {
            const user = await User.findById(userId);
            if (user && user.following.length > 0) {
                // Return posts from self AND people followed
                query = { user: { $in: [...user.following, userId] } };
            }
        }

        const posts = await Post.find(query)
            .populate("user", "username profilePic")
            .populate("comments.user", "username")
            .sort({ createdAt: -1 });

        return res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Could not fetch feed" });
    }
};

const getStories = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate("following", "username profilePic");

        if (!user) return res.status(404).json({ error: "User not found" });

        // Simple stories: just return the people you follow
        res.status(200).json(user.following);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch stories" });
    }
};

const getPendingTags = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({
            "tags.user": userId,
            "tags.status": "pending"
        }).populate("user", "username");

        return res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;
        const post = await Post.findByIdAndUpdate(
            postId,
            { $addToSet: { likes: userId } },
            { new: true }
        );
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: "Could not like post" });
    }
};

const unlikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;
        const post = await Post.findByIdAndUpdate(
            postId,
            { $pull: { likes: userId } },
            { new: true }
        );
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: "Could not unlike post" });
    }
};

const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, text } = req.body;
        const post = await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: { user: userId, text } } },
            { new: true }
        );
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: "Could not add comment" });
    }
};

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findByIdAndDelete(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Could not delete post" });
    }
};

const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { caption } = req.body;
        const post = await Post.findByIdAndUpdate(postId, { caption }, { new: true });
        if (!post) return res.status(404).json({ error: "Post not found" });
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: "Could not update post" });
    }
};

module.exports = {
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
};
