import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    emergencyContact: {
      name: { type: String, required: true },
      relation: { type: String, required: true },
      phone: { type: String, required: true },
    },
    allergies: {
      type: [String],
      default: [],
    },
    healthHistory: {
      type: [String],
      default: [],
    },
    currentMedications: {
      type: [String],
      default: [],
    },
    admitted: {
      type: Boolean,
      default: false,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },
    nurseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    dischargeDate: {
      type: Date,
      default: null,
    },
    insuranceDetails: {
      provider: { type: String },
      policyNumber: { type: String },
      validTill: { type: Date },
    },
    status: {
      type: String,
      enum: ["outpatient", "inpatient", "discharged"],
      default: "outpatient",
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
