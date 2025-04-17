import Patient from "../models/patient.model.js";
import User from "../models/user.model.js";

export const registerPatient = async (req, res) => {
  const {
    bloodGroup,
    emergencyContact,
    allergies = [],
    healthHistory = [],
    currentMedications = [],
    doctorId = null,
    nurseId = null,
    roomId = null,
    insuranceDetails = {},
    status = "outpatient",
  } = req.body;
  const userId = req.user.id;
  try {
    // check user exists or not
    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }
    // check if user is already exists as a patient
    const existingPatient = await Patient.findOne({ userId });
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "User is already registered as a patient!",
      });
    }
    // create a new patient
    const newPatient = new Patient({
      userId,
      bloodGroup,
      emergencyContact,
      allergies,
      healthHistory,
      currentMedications,
      doctorId,
      nurseId,
      roomId,
      insuranceDetails,
      status,
    });
    await newPatient.save();
    // send response
    return res.status(201).json({
      success: true,
      message: "Patient registered successfully!",
      Patient: newPatient,
    });
  } catch (error) {
    console.log(`Error in registerPatient: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate("userId", "-password -__v")
      .populate("doctorId", "-password -__v");
    //   .populate("nurseId", "-password -__v")
    //   .populate("roomId", "-__v");
    if (!patients) {
      return res.status(404).json({
        success: false,
        message: "No patients found!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Patients fetched successfully!",
      TotalPatients: patients.length,
      patients,
    });
  } catch (error) {
    console.log(`Error in getAllPatients: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPatientById = async (req, res) => {
  const { id } = req.params;
  try {
    // check if patient exists or not
    const patientExists = await Patient.findById(id);
    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: "Patient not found!",
      });
    }
    const patient = await Patient.findById(id)
      .populate("userId", "-password -__v")
      .populate("doctorId", "-password -__v");
    //   .populate("nurseId", "-password -__v")
    //   .populate("roomId", "-__v");
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Patient fetched successfully!",
      patient,
    });
  } catch (error) {
    console.log(`Error in getPatientById: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updatePatientProfile = async (req, res) => {
  const { id } = req.params;
  const {
    bloodGroup,
    emergencyContact,
    allergies,
    healthHistory,
    currentMedications,
    doctorId,
    nurseId,
    roomId,
    insuranceDetails,
  } = req.body;
  try {
    // check if patient exists or not
    const patientExists = await Patient.findById(id);
    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: "Patient not found!",
      });
    }
    // Make sure logged-in user is allowed to update the profile
    if (patientExists.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this profile.",
      });
    }
    const updateFields = {};
    if (bloodGroup !== undefined) updateFields.bloodGroup = bloodGroup;
    if (emergencyContact !== undefined)
      updateFields.emergencyContact = emergencyContact;
    if (allergies !== undefined) updateFields.allergies = allergies;
    if (healthHistory !== undefined) updateFields.healthHistory = healthHistory;
    if (currentMedications !== undefined)
      updateFields.currentMedications = currentMedications;
    if (doctorId !== undefined) updateFields.doctorId = doctorId;
    if (nurseId !== undefined) updateFields.nurseId = nurseId;
    if (roomId !== undefined) updateFields.roomId = roomId;
    if (insuranceDetails !== undefined)
      updateFields.insuranceDetails = insuranceDetails;
    const updatedPatient = await Patient.findByIdAndUpdate(id, updateFields, {
      new: true,
    })
      .populate("userId", "-password -__v")
      .populate("doctorId", "-password -__v");
    //   .populate("nurseId", "-password -__v")
    //   .populate("roomId", "-__v");
    return res.status(200).json({
      success: true,
      message: "Patient profile updated successfully!",
      patient: updatedPatient,
    });
  } catch (error) {
    console.log(`Error in updatePatientProfile: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const admitPatientToRoom = async (req, res) => {};
export const dischargePatient = async (req, res) => {};
