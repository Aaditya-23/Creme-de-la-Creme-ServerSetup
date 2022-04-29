import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(200).json({ message: "Unauthenticated" });

    // TODO change the secret key
    const decodedData = jwt.verify(token, "secret");
    req.userId = decodedData?._id;
    next();
  } catch (error) {
    console.log("Error in middleware", error.message);
    return res.status(401).json({ message: "Unauthenticated" });
  }
};

export default auth;
