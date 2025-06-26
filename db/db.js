import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

const connectToDB = async () => {
  try {
    const conection = await mongoose.connect(DB_URI);

    console.log(`Connected to DB host ${conection.connections[0].host}`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectToDB;
