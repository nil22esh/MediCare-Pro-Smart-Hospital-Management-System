import Doctor from "../models/doctor.model.js";
import User from "../models/user.model.js";

export const createDoctorProfile = async (req, res) => {
  const userId = req.user?._id.toString();
  const {
    specialization,
    qualifications,
    experience,
    department,
    availableSlots,
  } = req.body;
  //   validate input fields
  if (
    !specialization ||
    !qualifications ||
    !experience ||
    !department ||
    !availableSlots ||
    !userId
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required and must be valid!",
    });
  }
  try {
    // check user exists or not
    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }
    // Check if doctor profile already exists for the user
    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor profile already exists for this user!",
      });
    }
    // create new doctor
    const createDoctor = await Doctor.create({
      specialization,
      qualifications,
      experience,
      department,
      availableSlots,
      userId,
    });
    // send success response
    return res.status(201).json({
      success: true,
      message: "Doctor profile created successfully!",
      Doctor: createDoctor,
    });
  } catch (error) {
    console.log(`Error while creating doctor: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const allDoctors = await Doctor.find()
      .populate("userId", "-password -__v")
      .select("-__v");
    if (!allDoctors) {
      return res.status(404).json({
        success: false,
        message: "No doctors found!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Doctors fetched successfully!",
      count: allDoctors.length,
      doctors: allDoctors,
    });
  } catch (error) {
    console.log(`Error while getting all doctors: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getDoctorProfileById = async (req, res) => {
  const doctorId = req.params.doctorId;
  if (!doctorId) {
    return res.status(400).json({
      success: false,
      message: "Doctor ID is required!",
    });
  }
  try {
    // check if doctor exists or not
    const doctor = await Doctor.findById(doctorId)
      .populate("userId", "-password -__v")
      .select("-__v");
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found!",
      });
    }
    // Only allow the doctor to see their own profile
    if (doctor.userId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to see this profile.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Doctor profile fetched successfully!",
      doctor,
    });
  } catch (error) {
    console.log(`Error while getting profile: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateDoctorProfile = async (req, res) => {
  const doctorId = req.params.doctorId;
  const {
    specialization,
    qualifications,
    experience,
    department,
    availableSlots,
    rating,
    status,
  } = req.body;
  // validate input fields
  if (!doctorId) {
    return res.status(400).json({
      success: false,
      message: "Doctor ID is required!",
    });
  }
  try {
    // check if doctor exists or not
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found!",
      });
    }
    // Make sure logged-in user is allowed to update this doctor
    if (doctor.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this profile.",
      });
    }
    // update doctor profile
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      {
        specialization,
        qualifications,
        experience,
        department,
        availableSlots,
        rating,
        status,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully!",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.log(`Error while updating doctor profile: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteDoctorProfile = async (req, res) => {
  const doctorId = req.params.doctorId;
  // validate input fields
  if (!doctorId) {
    return res.status(400).json({
      success: false,
      message: "Doctor ID is required!",
    });
  }
  try {
    // check if doctor exists or not and delete it
    const doctor = await Doctor.findByIdAndDelete(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Doctor profile deleted successfully!",
      doctor,
    });
  } catch (error) {
    console.log(`Error while deleting doctor profile: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addAvailableSlot = async (req, res) => {};
export const removeAvailableSlot = async (req, res) => {};
export const updateSlotBookingStatus = async (req, res) => {};
export const getDoctorAvailableSlots = async (req, res) => {};
export const getDoctorBookedSlots = async (req, res) => {};
export const getDoctorAppointments = async (req, res) => {};
export const getDoctorPatients = async (req, res) => {};
export const getDoctorAnalytics = async (req, res) => {};
export const createPrescription = async (req, res) => {};
export const getPrescriptionsByDoctor = async (req, res) => {};
export const getPrescriptionByAppointment = async (req, res) => {};
