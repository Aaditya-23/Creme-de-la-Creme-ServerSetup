import express from "express";
import auth from "../../../config/AuthMiddleware.js";

const router = express.Router();

import {
  ListCourses,
  PostCourses,
  RateCourse,
  Comment,
  FetchCourse,
} from "../../../controllers/api/v1/course.js";

router.post("/list", ListCourses);
router.post("/add", auth, PostCourses);
router.post("/rate-course", auth, RateCourse);
router.post("/comment-course", auth, Comment);
router.post("/fetch-course", FetchCourse);

export default router;
