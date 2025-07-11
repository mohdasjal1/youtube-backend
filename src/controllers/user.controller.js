import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"; 
import mongoose from "mongoose";



// Refresh Access Token Controller
 const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        throw new ApiError(401, "Refresh token not found, please log in again");
    }

    try {
        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        // Check if the user exists
        const user = await User.findById(decodedToken._id).select("-password");

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token");
        }

        // Generate a new access token
        const accessToken = user.generateAccessToken();

        return res
            .status(200)
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
            })
            .json(new ApiResponse(200, { accessToken }, "Access Token refreshed successfully"));
    } catch (error) {
        throw new ApiError(401, "Invalid Refresh Token");
    }
});

const generateAccessandRefereshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    
    const {fullName, email, username, password} = req.body
    
    if (
      [fullName, email, username, password].some(
        (fields) => fields?.trim() === "" )  
    ) {
        throw new ApiError(400, "All fields are required")
    }
    
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")   
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    // const avatarLocalPath = req.files?.avatar && req.files.avatar.length > 0 
    // ? req.files.avatar[0].path 
    // : null;

    
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }


    //const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }


    

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is not uploaded")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),

    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering a user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered succesfully")
    )

} )

const loginUser = asyncHandler(async (req, res) => {
    // ( 1 ) req body -> data
    // ( 2 ) username or email
    // ( 3 ) find the user
    // ( 4 ) password check
    // ( 5 ) access and referesh token
    // ( 6 ) send cookie

    // (1)
    const {email, username, password} = req.body

    // (2)
    if(!(username || email)) {
        throw new ApiError(400, "username or email is required")
    }

    // (3)
    const user = await User.findOne({
        $or: [{email}, {username}]
    })

    
    if (!user) {
        throw new ApiError(404, "User doesn't exist")
    }

    // (4)
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    // (5)
    const {accessToken, refreshToken} = await generateAccessandRefereshTokens(user._id)

    // ( 6 )
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",       
        maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days in ms
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            // $set: {
            //     refreshToken: undefined
            // }
            
            $unset: {
                refreshToken: 1 //this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/"
    }

    return res
    .status(200)
    .clearCookie("accessToken", { ...options, path: "/"})
    .clearCookie("refreshToken", { ...options, path: "/"})
    .json(new ApiResponse(200, {}, "User logged Out"))

})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword, /* confirmPassword */} = req.body

    /*

    if (!(newPassword === confirmPassword )) {
        throw new ApiError(400, "password doesnt match")

    } */

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200) 
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {

        // (1) Check if user object exists on request (added by auth middleware)
        if (!req.user || !req.user._id) {
            throw new ApiError(401, "Unauthorized: User not found in request");
        }
    
        // (2) Fetch the user from the database to get the most up-to-date data
        const user = await User.findById(req.user._id).select("-password -refreshToken");
    
        // (3) Check if user was found in DB
        if (!user) {
            throw new ApiError(404, "User not found");
        }

    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,     //both are same and correct
                email: email  //both are same and correct
            }
        },
        {new: true} //will return info that of after update

    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,

        {
            $set:{
                avatar: avatar.url
            }   
        },

        {new: true}
    ).select("-password")

    //DELETE OLD-IMAGE (3:54) VID NO: 18

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})

const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover Image file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading Cover Image")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,

        {
            $set:{
                coverImage: coverImage.url
            }   
        },

        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "CoverImage updated successfully")
    )
})

const getUserChannelProfile = asyncHandler(async(req, res) => {
    const {username} = req.params //means url se

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            },
        },

        {
            $lookup: {                    //to join to models ig
                from: "subscriptions",   //lowercase and plural in DB
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },

        {
            $lookup: {
                from: "subscriptions",   //lowercase and plural in DB
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },

        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"   // dollar sign means its a field.
                },

                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },

                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]}, // $in can look into bjects and array, we gave it an object
                        then: true,
                        else: false
                    }
                }
            }
        },

        {
            $project: {  // we'll not give/project all the values insetad well give selected values

                fullName: 1,   //1 is a flag
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1,
                // createdAt: 1  (optional)
            }
        }
    ])

        if (!channel?.length) {
            throw new ApiError(404, "channel doesn't exist")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, channel[0], "User channel fetched successfully.")
        )
}) 

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $project: {
                watchHistory: { $reverseArray: "$watchHistory" } // Reverse the array to get the latest first
            }
        },
        {
            $unwind: "$watchHistory" // Unwind the watchHistory array
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "videoDetails",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner" // Get the first element of the owner array
                            }
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$videoDetails" // Unwind the videoDetails array
        },
        {
            $group: {
                _id: "$_id",
                watchHistory: { $push: "$videoDetails" } // Reconstruct the watchHistory array
            }
        }
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0]?.watchHistory || [],
                "Watch history fetched successfully."
            )
        );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory    
}