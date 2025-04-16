export const checkIsDoctor = (req, res, next) => {
  // Check if the user is a doctor
  if (req.user && req.user.role === "doctor") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Forbidden, Access denied. Only doctors are allowed!",
    });
  }
};
