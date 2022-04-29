import Course from "../../../models/Course.js";
import Organisation from "../../../models/Organisation.js";
import { uploadedImage, imageURL } from "../../../models/Course.js";
import Users from "../../../models/Users.js";

// TODO return userRatings from the server rather than calculating it on the frontend.

export const ListCourses = async (req, res) => {
  try {
    const getRating = (rating) => {
      let sum = 0;
      let count = 0;
      for (let id in rating) {
        sum += rating[id];
        count++;
      }
      return parseFloat((sum / count).toFixed(1));
    };

    const { sortParams } = req.body;
    const languages = JSON.parse(sortParams.langs);
    const organisations = JSON.parse(sortParams.orgs);

    let courses = null;

    switch (sortParams.criteria) {
      case "relevance":
        courses = await Course.find({}).lean();

        break;
      case "paid":
        courses = await Course.find({ fee: { $gte: 1 } }).lean();

        break;
      case "free":
        courses = await Course.find({ fee: 0 }).lean();

        break;
      default:
        break;
    }

    courses = courses.map((course) => {
      course.totalRating = getRating(course.rating);
      return course;
    });

    if (languages.length > 0) {
      courses = courses.filter((course) => {
        for (let lang of languages) {
          if (course.languages.includes(lang.code)) return true;
        }
      });
    }

    if (organisations.length > 0) {
      courses = courses.filter((course) => {
        for (let org of organisations)
          if (course.source.organisation === org.organisation) return true;
      });
    }

    if (sortParams.certificate) {
      courses = courses.filter((course) => course.certificateOfCompletion);
    }

    switch (sortParams.sortby) {
      case "rating":
        courses.sort((a, b) => b.totalRating - a.totalRating);
        break;
      case "high":
        courses.sort((a, b) => b.fee - a.fee);
        break;
      case "low":
        courses.sort((a, b) => a.fee - b.fee);
        break;
      default:
        break;
    }

    res.status(200).json({
      message: "course listed successfully",
      courses,
    });
  } catch (error) {
    console.log(`Error in listing all the courses, ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const PostCourses = async (req, res) => {
  try {
    const User = await Users.findById(req.userId);
    if (!User) return res.status(200).json({ message: "Unauthenticated" });

    uploadedImage(req, res, async function (error) {
      if (error) {
        console.log("multer error", error);
        return;
      }

      const formReq = req.body;
      formReq.instructors = formReq.instructors.split(",");
      formReq.syllabus = formReq.syllabus.split(",");
      formReq.imageURL = imageURL + "/" + req.file.filename;
      const org = await Organisation.findById(formReq.source);
      formReq.source = { organisation: org.organisation, logoURL: org.logoURL };
      const langs = JSON.parse(formReq.languages);
      formReq.languages = await langs.map((lang) => {
        return lang.code;
      });

      await Course.create(formReq);
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      return res.status(201).json({
        message: "Course added successfully",
      });
    });
  } catch (error) {
    console.log(`Error in posting the course, ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const RateCourse = async (req, res) => {
  try {
    const { courseId, value } = req.body;

    const course = await Course.findById(courseId);
    const user = await Users.findById(req.userId);

    if (!course || !user || value <= 0 || value > 5) {
      return res.status(200).json({ message: "Invalid Request" });
    }

    await course.rating.set(req.userId, value);
    await course.save();
    return res.status(201).json({ message: "Course rated successfully" });
  } catch (error) {
    console.log(`Error in rating the course, ${error}`);
    return res.status(200).json({ message: "Internal server error" });
  }
};

export const Comment = async (req, res) => {
  try {
    const { courseId, parentId, comment } = req.body;
    comment.createdAt = Date.now();
    comment.user = req.userId;
    let user = await Users.findById(req.userId);
    let course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(200).json({ message: "Invalid Request" });
    }

    if (parentId) {
      for (let array of course.comments) {
        if (array[0]._id.equals(parentId)) {
          await array.push(comment);
          await course.save();
          return res
            .status(201)
            .json({ message: "Comment added successfully" });
        }
      }
      return res.status(200).json({ message: "Invalid Request" });
    }

    await course.comments.push([comment]);
    await course.save();
    return res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    console.log("Error commenting on the course, ", error);
    return res.status(200).json({ message: "Internal server error" });
  }
};

export const FetchCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.body.id)
      .lean()
      .populate({
        path: "comments",
        populate: [
          [
            {
              path: "user",
              select: "name avatarURL",
              model: "Users",
            },
          ],
        ],
      });

    const getRating = (rating) => {
      let sum = 0;
      let count = 0;
      for (let id in rating) {
        sum += rating[id];
        count++;
      }
      return parseFloat((sum / count).toFixed(1));
    };

    course.totalRating = getRating(course.rating);

    if (!course) return res.status(200).json({ message: "Course not found" });

    return res
      .status(200)
      .json({ message: "Course fetched successfully", course });
  } catch (error) {
    console.log(`Error in fetching the course, ${error}`);
    return res.status(200).json({ message: "Internal server error" });
  }
};
