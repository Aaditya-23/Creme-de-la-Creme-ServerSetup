import mongoose from "mongoose";

const { Schema } = mongoose;

const languageSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  code: {
    type: String,
    required: true,
    lowercase: true,
  },
  nativeName: {
    type: String,
    required: true,
    lowercase: true,
  },
});

const Languages = mongoose.model("Languages", languageSchema);
export default Languages;
