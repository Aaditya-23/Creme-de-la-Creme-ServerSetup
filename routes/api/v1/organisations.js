import express from "express";
const router = express.Router();

import {
  GetOrganisations,
  PostOrganisation,
} from "../../../controllers/api/v1/organisations.js";

router.get("/list", GetOrganisations);
router.post("/add", PostOrganisation);

export default router;
