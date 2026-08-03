import "./config/env.js";
import express from "express";
import { connectToDatabase, disconnectFromDatabase } from "./config/database.js";

import authRoutes from "./routes/authRoutes.js"

connectToDatabase();

const app  = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use("/authentication", authRoutes);

const server = app.listen(port, () => {
  console.log(`Server is now running at http://localhost:${port}.`);
})

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection: ", err);
  server.close(async () => {
    await disconnectFromDatabase();
    process.exit(1);
  })
})

process.on("uncaughtException", async (err) => {
  console.log("Uncaught Exception: ", err);
  await disconnectFromDatabase();
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully.");
  server.close(async () => {
    await disconnectFromDatabase();
    process.exit(0);
  })
});