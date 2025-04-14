import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnection from "./db/dbConnection.js";
import userRouter from "./routes/user.routes.js";

// configuring dotenv
dotenv.config();

// creating express instance
const app = express();
const port = process.env.PORT || 8080;

// app level middlewares
app.use(express.json());
app.use(cookieParser());

// application routes
app.use("/api/v1/users", userRouter);

// starting the server
app.listen(port, () => {
  console.log(`${process.env.ENV} server is running on port ${port}`);
  // connecting to the database
  dbConnection();
});
