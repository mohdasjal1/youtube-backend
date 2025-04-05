import { Router } from 'express';
import { 
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike    
 } from '../controllers/like.controller.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

// Route to like a post
router.route("/videos").get(getLikedVideos);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);

export default router;