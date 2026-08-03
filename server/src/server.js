import express from 'express';
import { config } from 'dotenv'

config();

const app  = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.status(200).json({status: "success", message: "Welcome to the comic center API."});
})

const server = app.listen(port, () => {
  console.log(`Server is now running at http://localhost:${port}.`);
})

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection: ", err);
  server.close(() => {
    process.exit(1);
  })
})

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception: ", err);
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully.");
  server.close(() => {
    process.exit(0);
  })
});