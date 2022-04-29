import Users from "../../../models/Users.js";
import Course from "../../../models/Course.js";
import { uploadImage, imageURL } from "../../../models/Users.js";
import jwt from "jsonwebtoken";
import PasswordValidator from "password-validator";
import bcrypt from "bcrypt";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const __dirname = path.resolve();
const unlinkAsync = promisify(fs.unlink);

export const CreateUser = async (req, res) => {
  try {
    let User = await Users.findOne({ email: req.body.email });
    let message;

    const schema = new PasswordValidator();
    schema
      .is()
      .min(8)
      .is()
      .max(200)
      .has()
      .letters()
      .has()
      .lowercase()
      .has()
      .uppercase()
      .has()
      .digits()
      .has()
      .symbols();

    const validation = schema.validate(req.body.password, { details: true });

    if (
      User ||
      validation.length > 0 ||
      req.body.password !== req.body.confirmPassword
    ) {
      if (req.body.password !== req.body.confirmPassword) {
        message = "Passwords do not match";
      } else message = "User with the same email address exists already";
      return res.status(200).json({
        isCreated: false,
        validation,
        message,
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    let { gender } = req.body.gender;
    if (gender != "male" || gender != "female" || gender != "other")
      gender = null;

    await Users.create({
      ...req.body,
      password: hashedPassword,
      gender: gender,
    });
    return res.status(201).json({
      isCreated: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(`Error occured while creating a user, ${error}`);
    return res.status(200).json({
      isCreated: false,
      message: "Internal Server Error. Please try again later",
      error: Object.entries(error.errors),
    });
  }
};

export const CreateSession = async (req, res) => {
  try {
    let User = await Users.findOne({ email: req.body.email });

    if (!User || !(await bcrypt.compare(req.body.password, User.password))) {
      return res.status(200).json({
        isAuthenticated: false,
        message: "Invalid Username/Password",
        data: {
          token: null,
        },
      });
    }

    return res.status(201).json({
      isAuthenticated: true,
      message: "User Authenticated Successfully",
      data: {
        //TODO: Change and hide the secret key
        token: jwt.sign(User.toJSON(), "secret", { expiresIn: "48h" }),
        User,
      },
    });
  } catch (error) {
    console.log(`Error occured while creating a session, ${error}`);
    return res.status(200).json({
      isAuthenticated: false,
      message: "Internal Server Error.",
    });
  }
};

export const SocialAuth = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decodedData = jwt.decode(token);

    let User = await Users.findOne({ email: decodedData.email });

    if (!User) {
      const password = crypto.randomBytes(20).toString("hex");
      const hashedPassword = await bcrypt.hash(password, 12);
      const { name, email } = decodedData;
      User = await Users.create({
        name,
        email,
        password: hashedPassword,
      });
    }

    return res.status(200).json({
      isAuthenticated: true,
      message: "User Authenticated Successfully",
      data: {
        token: jwt.sign(User.toJSON(), "secret", { expiresIn: "48h" }),
        User,
      },
    });
  } catch (error) {
    console.log("Error in Social Authentication", error);
    return res.status(200).json({ message: "Internal Server Error" });
  }
};

export const UpdateUserProfile = (req, res) => {
  uploadImage(req, res, async function () {
    try {
      let User = await Users.findById(req.userId);

      if (!User) {
        return res
          .status(200)
          .json({ message: "Invalid Request", isUpdated: false });
      }

      User.name = req.body.name;
      User.gender = req.body.gender;
      if (req.file) {
        if (User.avatarURL)
          await unlinkAsync(path.join(__dirname, User.avatarURL));
        User.avatarURL = imageURL + "/" + req.file.filename;
      }

      await User.save();

      return res
        .status(201)
        .json({ message: "User updated successfully", isUpdated: true });
    } catch (error) {
      console.log(`Error occured while updating the user, ${error}`);
      return res.status(200).json({
        message: "Internal Server Error.",
      });
    }
  });
};

export const GetUser = async (req, res) => {
  try {
    let User = await Users.findById(req.userId).lean().populate("favourites");

    if (!User) {
      return res.status(200).json({ message: "No such user exists" });
    }

    User.password = undefined;

    return res.status(200).json({ message: "User found", User });
  } catch (error) {
    console.log(`Error occured while fetching the user, ${error}`);
    return res.status(200).json({
      message: "Internal Server Error.",
    });
  }
};

export const ToggleFavourites = async (req, res) => {
  try {
    let user = await Users.findById(req.userId);
    let course = await Course.findById(req.body.courseId);

    if (!user || !course) {
      return res.status(200).json({ message: "Invalid Request" });
    }

    const index = await user.favourites.indexOf(course._id);

    if (index > -1) {
      user.favourites.splice(index, 1);
      user.save();
      return res
        .status(201)
        .json({ message: "Removed from favourites", toggled: true });
    } else {
      user.favourites.push(course);
      user.save();
      return res
        .status(201)
        .json({ message: "Course added to favourites", toggled: true });
    }
  } catch (error) {
    console.log("Error in adding the course to favourites", error.message);
    return res.status(200).json({ message: "Internal Server Error." });
  }
};
