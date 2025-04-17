import express from "express";
import jwtAuth from "./../middlewares/jwtAuth.middleware.js";
import { checkIsPatient } from "./../middlewares/isPatient.middleware.js";
import {
  getAllPatients,
  getPatientById,
  registerPatient,
  updatePatientProfile,
} from "../controllers/patient.controller.js";
import { checkIsAdmin } from "./../middlewares/isAdmin.middleware.js";

const patientRouter = express.Router();

patientRouter.post("/add-patient", jwtAuth, checkIsPatient, registerPatient);

patientRouter.get("/get-all-patients", jwtAuth, checkIsAdmin, getAllPatients);

patientRouter.get("/get-patient/:id", jwtAuth, checkIsPatient, getPatientById);

patientRouter.put(
  "/update-patient/:id",
  jwtAuth,
  checkIsPatient,
  updatePatientProfile
);

export default patientRouter;
