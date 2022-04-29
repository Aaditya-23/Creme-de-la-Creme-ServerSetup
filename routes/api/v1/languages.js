import express from "express";
const router = express.Router();

import {
  AddLanguage,
  GetLanguages,
} from "../../../controllers/api/v1/languages.js";
router.post("/add", AddLanguage);
router.get("/list", GetLanguages);

export default router;
