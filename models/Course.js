import mongoose from "mongoose";
import multer from "multer";
import path from "path";
const __dirname = path.resolve();
const imageURL = path.join("/uploads/course-images");
const { Schema } = mongoose;

const CourseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: true,
      lowercase: true,
    },
    learningType: {
      type: String,
      required: true,
      lowercase: true,
      validate: {
        validator: (value) => {
          return value === "self-paced" || value === "cohort-learning";
        },
        message: (props) => {
          console.log(`${props.value}, is not a valid value for this field`);
        },
      },
    },
    fee: {
      type: Number,
      min: 0,
      required: true,
    },
    duration: {
      type: Number,
      min: 0,
      required: true,
    },
    trial: {
      type: Boolean,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },

    //   TODO Change rating functionality
    rating: {
      type: Map,
      of: { type: Number, min: 0, max: 5 },
      default: new Map(),
    },
    languages: {
      type: Array,
      required: true,
      lowercase: true,
    },
    certificateOfCompletion: {
      type: Boolean,
      required: true,
    },
    instructors: {
      type: Array,
      required: true,
    },
    source: {
      type: Map,
      of: { type: String },
      required: true,
    },
    link: {
      type: String,
      required: true,
      lowercase: true,
    },
    syllabus: {
      type: Array,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    comments: [
      [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "Users",
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
          createdAt: {
            type: String,
            required: true,
          },
        },
      ],
    ],
  },
  {
    timestamps: true,
  }
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, imageURL));
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/")[1];
    const suffix = `-${Date.now()}.${extension}`;
    cb(null, file.fieldname + suffix);
  },
});

const fileFilter = (req, file, cb) => {
  const type = file.mimetype;

  switch (type) {
    case "image/png":
      cb(null, true);
      break;
    case "image/jpg":
      cb(null, true);
      break;
    case "image/jpeg":
      cb(null, true);
      break;
    default:
      cb(null, false);
  }
};

const uploadedImage = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("courseImage");

const Course = mongoose.model("Course", CourseSchema);
export { uploadedImage, imageURL };
export default Course;
