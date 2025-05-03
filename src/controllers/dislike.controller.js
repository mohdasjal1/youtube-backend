import mongoose, { isValidObjectId } from "mongoose";
import { Dislike } from "../models/dislike.model.js";
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";

// Toggle Dislike on Video

const toggleVideoDislike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
     throw new ApiError(400, "Invalid videoId")
  }

  const dislikedAlready = await Dislike.findOne({
      video: videoId,
      dislikedBy: req.user?._id
  });

  if (dislikedAlready) {
    await Dislike.findByIdAndDelete(dislikedAlready?._id)

    return res
    .status(200)
    .json(new ApiResponse(200, {isDisliked: false}));
  }

  await Like.deleteOne({ 
    video: videoId,
    likedBy: req.user?._id 
});

  await Dislike.create({
      video: videoId,
      dislikedBy: req.user?._id
  })

  return res
  .status(200)
  .json(new ApiResponse(200, {isDisliked: true}))
});

// Toggle Dislike on Comment
const toggleCommentDislike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
     throw new ApiError(400, "Invalid commentId")
  }

  const dislikedAlready = await Dislike.findOne({
      comment: commentId,
      dislikedBy: req.user?._id
  })

  if (dislikedAlready) {
    await Dislike.findByIdAndDelete(dislikedAlready?._id)

    return res
    .status(200)
    .json(new ApiResponse(200, {isDisliked: false}));
  }

  await Dislike.create({
      comment: commentId,
      dislikedBy: req.user?._id
  })

  return res
  .status(200)
  .json(new ApiResponse(200, {isDisliked: true}));
});

// Toggle Dislike on Tweet
const toggleTweetDislike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
      throw new ApiError(400, "Invalid tweetId")
  }

  const dislikedAlready = await Dislike.findOne({
      tweet: tweetId,
      dislikedBy: req.user?._id
    });

  if (dislikedAlready) {
    await Dislike.findByIdAndDelete(dislikedAlready?._id)

    return res
    .status(200)
    .json(new ApiResponse(200, { isDisliked: false }));
  }

  await Dislike.create({
    tweet: tweetId,
    dislikedBy: req.user?._id
  })

  return res
  .status(200)
  .json(new ApiResponse(200, {isDisliked: true}));
});



// const toggleVideoDislike = async (req, res) => {
//   const { videoId } = req.params;
//   const userId = req.user._id;

//   const existingDislike = await Dislike.findOne({ video: videoId, dislikedBy: userId });

//   if (existingDislike) {
//     await existingDislike.deleteOne();
//     return res
//     .status(200)
//     .json(new ApiResponse(200, {isDisliked: false}));
//   }

//   // Optional: remove like if it exists
//   await Dislike.deleteOne({ video: videoId, dislikedBy: userId });

//   const dislike = await Dislike.create({ video: videoId, dislikedBy: userId });

//   return res
//   .status(200)
//   .json(new ApiResponse(200, {isDisliked: true}));
// };

// // Toggle Dislike on Comment
// const toggleCommentDislike = async (req, res) => {
//   const { commentId } = req.params;
//   const userId = req.user._id;

//   const existingDislike = await Dislike.findOne({ comment: commentId, dislikedBy: userId });

//   if (existingDislike) {
//     await existingDislike.deleteOne();
//     return res.status(200).json(new ApiResponse(200, null, "Comment dislike removed"));
//   }

//   await Dislike.deleteOne({ comment: commentId, dislikedBy: userId });

//   const dislike = await Dislike.create({ comment: commentId, dislikedBy: userId });

//   return res.status(200).json(new ApiResponse(200, dislike, "Comment disliked successfully"));
// };

// // Toggle Dislike on Tweet
// const toggleTweetDislike = async (req, res) => {
//   const { tweetId } = req.params;
//   const userId = req.user._id;

//   const existingDislike = await Dislike.findOne({ tweet: tweetId, dislikedBy: userId });

//   if (existingDislike) {
//     await existingDislike.deleteOne();
//     return res.status(200).json(new ApiResponse(200, null, "Tweet dislike removed"));
//   }

//   await Dislike.deleteOne({ tweet: tweetId, dislikedBy: userId });

//   const dislike = await Dislike.create({ tweet: tweetId, dislikedBy: userId });

//   return res.status(200).json(new ApiResponse(200, dislike, "Tweet disliked successfully"));
// };


export { toggleVideoDislike, toggleCommentDislike, toggleTweetDislike };