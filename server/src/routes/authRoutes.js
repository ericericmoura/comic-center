import express from "express"
import { login, logout, register } from "../controllers/authController.js";
import { registerSchema } from "../validators/authValidators.js";
import { validateRequestMiddleware } from "../middlewares/validateRequestMiddleware.js";

const router = express.Router();

router
  .post("/register", validateRequestMiddleware(registerSchema), register)
  .post("/login"   , login)
  .post("/logout"  , logout);

export default router;