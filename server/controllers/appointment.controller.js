import moment from "moment";
import Appointment from "../models/appointment.model.js";
import Patient from "./../models/patient.model.js";
import Doctor from "./../models/doctor.model.js";

export const bookAppointment = async (req, res) => {
  const patientId = req.user._id.toString();
  const { date, time, symptoms } = req.body;
  //   validate the request body
  if (!date || !time || !symptoms) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    // Validate time format
    if (!/^\d{2}:\d{2}$/.test(time)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time format (HH:mm expected)",
      });
    }
    // Check for past date/time
    const appointmentDateTime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm");
    if (
      !appointmentDateTime.isValid() ||
      appointmentDateTime.isBefore(moment())
    ) {
      return res.status(400).json({
        success: false,
        message: "Appointment date/time must be in the future",
      });
    }
    // check if the patient already exists
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }
    // Ensure doctorId exists for patient
    if (!patient.doctorId) {
      return res.status(400).json({
        success: false,
        message: "No doctor assigned to this patient",
      });
    }
    // check if the appointment already exists
    const existingAppointment = await Appointment.findOne({
      patientId,
      date,
      time,
    });
    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "Appointment already exists",
      });
    }
    // create the appointment
    const appointment = new Appointment({
      patientId: patient._id,
      doctorId: patient.doctorId,
      date,
      time,
      symptoms,
    });
    await appointment.save();
    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAppointmentById = async (req, res) => {
  const appointmentId = req.params.id;
  // validate the appointmentId
  if (!appointmentId) {
    return res.status(400).json({
      success: false,
      message: "Appointment ID is required",
    });
  }
  try {
    const appointment = await Appointment.findById(appointmentId)
      .populate("patientId", "-__v")
      .populate("doctorId", "-__v")
      .select("-__v");
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Appointment fetched successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAppointmentByPatientId = async (req, res) => {
  const userId = req.user._id.toString();
  try {
    // Find the patient associated with this user
    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found for this user",
      });
    }
    const appointments = await Appointment.find({ patientId: patient._id })
      .populate("patientId", "-__v")
      .populate("doctorId", "-__v")
      .select("-__v");
    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      total: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAppointmentByDoctorId = async (req, res) => {
  const userId = req.user._id.toString();
  try {
    // Find the doctor associated with this user
    const doctor = await Doctor.findOne({ userId });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found for this user",
      });
    }
    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate("patientId", "-__v")
      .populate("doctorId", "-__v")
      .select("-__v");
    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      total: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  if (!appointmentId) {
    return res.status(400).json({
      success: false,
      message: "Appointment ID is required",
    });
  }
  const { date, time, symptoms } = req.body;
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    // Validate date and time format strictly
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format (YYYY-MM-DD expected)",
      });
    }
    if (!/^\d{2}:\d{2}$/.test(time)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time format (HH:mm expected)",
      });
    }
    const appointmentDateTime = moment(
      `${date} ${time}`,
      "YYYY-MM-DD HH:mm",
      true
    );
    if (
      !appointmentDateTime.isValid() ||
      appointmentDateTime.isBefore(moment())
    ) {
      return res.status(400).json({
        success: false,
        message: "Appointment date/time must be valid and in the future",
      });
    }
    // Optional: Check if rescheduling too close to the current time
    const now = moment();
    const diffInMinutes = appointmentDateTime.diff(now, "minutes");
    if (diffInMinutes < 60) {
      return res.status(400).json({
        success: false,
        message: "Cannot reschedule less than 1 hour before appointment",
      });
    }
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }
    if (appointment.patientId.toString() !== patient._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this appointment.",
      });
    }
    // Update the appointment
    appointment.date = date;
    appointment.time = time;
    appointment.symptoms = symptoms || appointment.symptoms;
    await appointment.save();
    return res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    console.error(`Error updating appointment: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  // validate the appointmentId
  if (!appointmentId) {
    return res.status(400).json({
      success: false,
      message: "Appointment ID is required",
    });
  }
  try {
    const appointment = await Appointment.findByIdAndDelete(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
