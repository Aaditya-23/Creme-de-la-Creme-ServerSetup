import Organisation from "../../../models/Organisation.js";

import { uploadImage, imageURL } from "../../../models/Organisation.js";

export const GetOrganisations = async (req, res) => {
  try {
    const orgs = await Organisation.find({});
    return res.status(200).json({ message: "success", organisations: orgs });
  } catch (error) {
    console.log("Error in fetching organisations from the database", error);
    return res.status(200).json({ message: "Internal Server Error" });
  }
};

export const PostOrganisation = (req, res) => {
  uploadImage(req, res, async function () {
    try {
      const data = req.body;
      console.log(data);

      let org = await Organisation.findOne({
        organisation: data.organisation,
      });

      if (org) {
        return res.status(200).json({
          message: "Organisation exists already",
        });
      }

      data.logoURL = `${imageURL}/${req.file.filename}`;
      await Organisation.create(data);

      return res.status(201).json({ message: "Organisation Added" });
    } catch (error) {
      console.log("Error in posting organisation", error);
      return res.status(200).json({ message: "Internal Server Error" });
    }
  });
};
