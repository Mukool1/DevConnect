import User from "../models/user.js";
import Notification from "../models/notification.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password",
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar, skills, socialLinks } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        bio,
        avatar,
        skills,
        socialLinks,
      },
      { new: true, runValidators: true },
    ).select("-password");
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate(
      "followers",
      "name username avatar bio",
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, followers: user.followers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate(
      "following",
      "name username avatar bio",
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, following: user.following });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    if (targetId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You can't follow yourself",
      });
    }
    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const alreadyFollowing = targetUser.followers.includes(req.user._id);
    if (alreadyFollowing) {
      return res
        .status(400)
        .json({ success: false, message: "Already following this user" });
    }

    targetUser.followers.push(req.user._id);
    await targetUser.save();

    const currentUser = await User.findById(req.user._id);
    currentUser.following.push(targetId);
    await currentUser.save();

    await Notification.create({
      recipient: targetId,
      sender: req.user._id,
      type: "follow",
    });

    res.status(200).json({ success: true, message: "User followed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const targetId = req.params.id;

    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== req.user._id.toString(),
    );
    await targetUser.save();

    const currentUser = await User.findById(req.user._id);
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetId,
    );
    await currentUser.save();

    res.status(200).json({ success: true, message: "User unfollowed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
