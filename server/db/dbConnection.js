import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    // MongoDB connection string
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "MedicareDB",
    });
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
  } catch (error) {
    // Exit process with failure
    console.error("Error connecting to the database:", error);
    console.error("Error message:", error.message);
    console.error("Error cause:", error.cause);
    process.exit(1);
  }
};

export default dbConnection;
