//* Import modules
import express from "express";
const router = express.Router();

//* Import routes
import users from "./users.js";
import course from "./course.js";
import organisations from "./organisations.js";
import languages from "./languages.js";

//* Import controllers
import { Home } from "../../../controllers/api/v1/home.js";

router.get("/", Home);
router.use("/users", users);
router.use("/course", course);
router.use("/organisations", organisations);
router.use("/languages", languages);

export default router;
