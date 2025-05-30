import { Router } from "express";
import {
    addComment,
    deleteComment,
    updateComment,
    getVideoComments
} from "../controllers/comment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT, upload.none()); // Apply verifyJWT middleware to all routes in this file and made sure that user can't add files in comment.

router.route("/:videoId").get(getVideoComments).post(addComment)
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router