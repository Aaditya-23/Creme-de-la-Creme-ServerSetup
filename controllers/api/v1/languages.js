import Languages from "../../../models/Languages.js";

export const AddLanguage = async (req, res) => {
  try {
    const lang = await Languages.findOne({ code: req.body.code });
    if (lang) {
      return res.status(200).json({ message: "Language already exists" });
    }

    await Languages.create(req.body);
    return res.status(201).json({ message: "Language added successfully" });
  } catch (error) {
    console.log("Error in adding language", error);
    return res.status(200).json({ message: "Internal server error" });
  }
};

export const GetLanguages = async (req, res) => {
  try {
    const langs = await Languages.find({});

    return res.status(200).json({ languages: langs });
  } catch (error) {
    console.log("Error in getting languages", error);
    return res.status(200).json({ message: "Internal server error" });
  }
};
