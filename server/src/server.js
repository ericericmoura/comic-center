import "./config/env.js";
import express from "express";
import { connectToDatabase, disconnectFromDatabase, prisma } from "./config/database.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js"
import comicsRoutes from "./routes/comicsRoutes.js"
import comicRatingsRoutes from "./routes/comicRatingsRoutes.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { Role } from "./generated/prisma/enums.ts"; 

connectToDatabase();

const app  = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use("/authentication", authRoutes  );
app.use("/comics"        , comicsRoutes);
app.use("/comic-ratings" , comicRatingsRoutes);

app.get("/hello", async (req, res) => {  
  res.status(200).json({message: "Hello, World!"});
});

app.get("/secure/user", authMiddleware(Role.USER), async (req, res) => {
  res.status(200).json({ message: "Hello, User!" });
});

app.get("/secure/admin", authMiddleware(Role.ADMIN), async (req, res) => {
  res.status(200).json({ message: "Hello, Admin!" });
});

// error handling middlewares
app.use(notFound);
app.use(errorHandler);

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