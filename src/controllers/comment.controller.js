import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;  // Get videoId from URL parameters
    const { page = 1, limit = 10 } = req.query;  // Set up pagination with defaults

    if (!videoId) {
        throw new ApiError(400, "VideoID is missing !")
    }

    const skip = (page - 1) * limit;  // Calculate the number of documents to skip

    // Fetch comments based on videoId
    const comments = await Comment.find({ videoId })  // Search for comments with this videoId
        .skip(skip)  // Skip for pagination
        .limit(parseInt(limit))  // Limit the number of comments returned
        .exec();  // Execute the query

    // Optionally, get the total number of comments for this video
    const totalComments = await Comment.countDocuments({ videoId });


    // Send back the comments and pagination info
    return res
    .status(200)
    json({
        page: parseInt(page),
        limit: parseInt(limit),
        totalComments,
        comments
    });

    
});


const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})


export {
    getVideoComments
}
