export const checkIsPatient = (req, res, next) => {
  // Check if the user is authenticated and has the role of 'patient'
  if (req.user && req.user.role === "patient") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Forbidden, you do not have permission to access this resource!",
    });
  }
};
