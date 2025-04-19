import express from "express";
import jwtAuth from "../middlewares/jwtAuth.middleware.js";
import { checkIsPatient } from "../middlewares/isPatient.middleware.js";
import { checkIsDoctor } from "./../middlewares/isDoctor.middleware.js";
import {
  bookAppointment,
  deleteAppointment,
  getAppointmentByDoctorId,
  getAppointmentById,
  getAppointmentByPatientId,
  updateAppointment,
} from "../controllers/appointment.controller.js";

const appointmentRouter = express.Router();

appointmentRouter.post(
  "/book-appointment",
  jwtAuth,
  checkIsPatient,
  bookAppointment
);

appointmentRouter.get(
  "/appointment/:id",
  jwtAuth,
  checkIsPatient,
  getAppointmentById
);

appointmentRouter.get(
  "/my-appointments",
  jwtAuth,
  checkIsPatient,
  getAppointmentByPatientId
);

appointmentRouter.get(
  "/booked-appointments",
  jwtAuth,
  checkIsDoctor,
  getAppointmentByDoctorId
);

appointmentRouter.put(
  "/update-appointment/:id",
  jwtAuth,
  checkIsPatient,
  updateAppointment
);

appointmentRouter.delete(
  "/delete-appointment/:id",
  jwtAuth,
  checkIsPatient,
  deleteAppointment
);

export default appointmentRouter;
