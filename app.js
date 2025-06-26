import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use("/users", userRoutes);

export default app;
