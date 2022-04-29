import express from "express";
import passport from "passport";
const router = express.Router();

import {
  CreateUser,
  CreateSession,
  SocialAuth,
  UpdateUserProfile,
  GetUser,
  ToggleFavourites,
} from "../../../controllers/api/v1/users.js";

import auth from "../../../config/AuthMiddleware.js";

router.post("/sign-up", CreateUser);
router.post("/sign-in", CreateSession);
router.post("/socialAuth", SocialAuth);
router.post("/update-user-profile", auth, UpdateUserProfile);
router.post("/get-user", auth, GetUser);
router.post("/toggle-favourites", auth, ToggleFavourites);

export default router;
