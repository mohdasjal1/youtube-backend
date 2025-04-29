import { Dislike } from "../models/dislike.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Toggle Dislike on Video
const toggleVideoDislike = async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  const existingDislike = await Dislike.findOne({ video: videoId, dislikedBy: userId });

  if (existingDislike) {
    await existingDislike.deleteOne();
    return res.status(200).json(new ApiResponse(200, null, "Video dislike removed"));
  }

  // Optional: remove like if it exists
  await Dislike.deleteOne({ video: videoId, dislikedBy: userId });

  const dislike = await Dislike.create({ video: videoId, dislikedBy: userId });

  return res.status(200).json(new ApiResponse(200, dislike, "Video disliked successfully"));
};

// Toggle Dislike on Comment
const toggleCommentDislike = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const existingDislike = await Dislike.findOne({ comment: commentId, dislikedBy: userId });

  if (existingDislike) {
    await existingDislike.deleteOne();
    return res.status(200).json(new ApiResponse(200, null, "Comment dislike removed"));
  }

  await Dislike.deleteOne({ comment: commentId, dislikedBy: userId });

  const dislike = await Dislike.create({ comment: commentId, dislikedBy: userId });

  return res.status(200).json(new ApiResponse(200, dislike, "Comment disliked successfully"));
};

// Toggle Dislike on Tweet
const toggleTweetDislike = async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  const existingDislike = await Dislike.findOne({ tweet: tweetId, dislikedBy: userId });

  if (existingDislike) {
    await existingDislike.deleteOne();
    return res.status(200).json(new ApiResponse(200, null, "Tweet dislike removed"));
  }

  await Dislike.deleteOne({ tweet: tweetId, dislikedBy: userId });

  const dislike = await Dislike.create({ tweet: tweetId, dislikedBy: userId });

  return res.status(200).json(new ApiResponse(200, dislike, "Tweet disliked successfully"));
};


export { toggleVideoDislike, toggleCommentDislike, toggleTweetDislike };