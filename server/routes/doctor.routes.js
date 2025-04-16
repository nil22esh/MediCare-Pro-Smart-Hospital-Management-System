import express from "express";
import jwtAuth from "./../middlewares/jwtAuth.middleware.js";
import {
  createDoctorProfile,
  deleteDoctorProfile,
  getAllDoctors,
  getDoctorProfileById,
  updateDoctorProfile,
} from "../controllers/doctor.controller.js";
import { checkIsDoctor } from "../middlewares/isDoctor.middleware.js";
import { checkIsAdmin } from "./../middlewares/isAdmin.middleware.js";

const doctorRouter = express.Router();

doctorRouter.post(
  "/create-doctor-profile",
  jwtAuth,
  checkIsDoctor,
  createDoctorProfile
);

doctorRouter.get("/all-doctors", jwtAuth, checkIsAdmin, getAllDoctors);

doctorRouter.get(
  "/doctor-profile/:doctorId",
  jwtAuth,
  checkIsDoctor,
  getDoctorProfileById
);

doctorRouter.put(
  "/update-profile/:doctorId",
  jwtAuth,
  checkIsDoctor,
  updateDoctorProfile
);

doctorRouter.delete(
  "/delete-profile/:doctorId",
  jwtAuth,
  checkIsAdmin,
  deleteDoctorProfile
);

// doctorRouter.post("/slots/add", jwtAuth, isDoctor, addAvailableSlot);
// doctorRouter.delete("/slots/remove/:slotId", jwtAuth, isDoctor, removeAvailableSlot);
// doctorRouter.get("/slots/:doctorId", jwtAuth, getDoctorAvailableSlots);

// doctorRouter.get("/appointments", jwtAuth, isDoctor, getDoctorAppointments);
// doctorRouter.get("/patients", jwtAuth, isDoctor, getDoctorPatients);
// doctorRouter.get("/analytics", jwtAuth, isDoctor, getDoctorAnalytics);

export default doctorRouter;
