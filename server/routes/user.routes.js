import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUserProfile,
} from "../controllers/user.controller.js";
import jwtAuth from "../middlewares/jwtAuth.middleware.js";
import { checkIsAdmin } from "../middlewares/isAdmin.middleware.js";

const userRouter = express.Router();

// creating user routes
userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.post("/logout", jwtAuth, logoutUser);

userRouter.get("/get-user/:id", jwtAuth, getUserById);

userRouter.put("/update-user-profile", jwtAuth, updateUserProfile);

userRouter.get("/get-all-users", jwtAuth, checkIsAdmin, getAllUsers);

userRouter.delete("/delete-user/:id", jwtAuth, checkIsAdmin, deleteUser);

userRouter.put("/reset-password", resetPassword);

export default userRouter;
