import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const jwtAuth = async (req, res, next) => {
  // Check if the JWT token is present in the cookies
  const token = req.cookies.jwtToken;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized, token not found!" });
  }
  try {
    // Verify the JWT token using the secret key
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized, token not valid!" });
    }
    // Attach the decoded user information to the request object
    const user = await User.findById(decoded.id).select("-password -__v");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized, user not found!" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized, token expired!" });
  }
};

export default jwtAuth;
