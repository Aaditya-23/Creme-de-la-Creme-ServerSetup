//* import modules
import express from "express";
const router = express.Router();

//* import controllers

import { Home } from "../controllers/home_controller.js";
import api from "./api/index.js";

router.get("/", Home);
router.use("/api", api);

export default router;
