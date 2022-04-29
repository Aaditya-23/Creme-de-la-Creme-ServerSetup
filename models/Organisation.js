import mongoose from "mongoose";
import multer from "multer";
import path from "path";
const __dirname = path.resolve();
const imageURL = path.join("/uploads/organisation-images");

const { Schema } = mongoose;

const OrganisationSchema = new Schema(
  {
    organisation: {
      type: String,
      required: true,
    },
    logoURL: {
      type: String,
      required: true,
    },
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

const uploadImage = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("organisationLogo");

const Organisation = mongoose.model("Organisation", OrganisationSchema);
export { uploadImage, imageURL };
export default Organisation;
