import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialization: {
      type: String,
      required: true,
      enum: [
        "Cardiologist",
        "Dermatologist",
        "Neurologist",
        "Oncologist",
        "Orthopedic",
        "Pediatrician",
        "General Physician",
        "Psychiatrist",
        "ENT Specialist",
        "Gynecologist",
        "Other",
      ],
    },
    qualifications: {
      type: [String],
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    availableSlots: [
      {
        date: { type: String, required: true },
        time: { type: String, required: true },
        isBooked: { type: Boolean, default: false },
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    status: {
      type: String,
      enum: ["on-duty", "off-duty"],
      default: "on-duty",
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
