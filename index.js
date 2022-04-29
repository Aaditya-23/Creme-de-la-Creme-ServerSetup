//* Import node modules

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Configure_Database from "./config/mongoose.js";
import passportJWTStrategy from "./config/Passport-JWT-Strategy.js";
import passport from "passport";

//* Import routes
import routes from "./routes/index.js";

//* Configure dotenv
dotenv.config();

const port = process.env.PORT || 8000;
const app = express();
app.use(express.static("./"));

app.use(express.json({ limit: "10MB" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//* Call out functions if any
app.use(passport.initialize());
passportJWTStrategy();
Configure_Database();

app.use("/", routes);

app.listen(port, (error) => {
  if (error) {
    console.log(`Error in firing up the server, ${error}`);
    return;
  }
  console.log(`Server is running on port, ${port}`);
});
