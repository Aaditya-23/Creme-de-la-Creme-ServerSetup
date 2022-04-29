//* Import modules
import express from "express";
const router = express.Router();

//* Import controllers
import api_v1 from "./v1/index.js";

router.use("/v1", api_v1);

export default router;
