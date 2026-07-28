import User from "../models/user.js";
import Post from "../models/post.js";

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    }

    const regex = new RegExp(q.trim(), "i");

    const users = await User.find({
      $or: [{ name: regex }, { username: regex }, { skills: regex }],
    }).select("-password");

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    }

    const regex = new RegExp(q.trim(), "i");

    const posts = await Post.find({ content: regex })
      .sort({ createdAt: -1 })
      .populate("author", "name username avatar");

    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
