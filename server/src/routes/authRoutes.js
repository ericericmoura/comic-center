import express from "express"
import { confirmEmail, login, logout, register, resendConfirmationEmail } from "../controllers/authController.js";
import { loginSchema, registerSchema } from "../validators/authValidators.js";
import { validateRequestMiddleware } from "../middlewares/validateRequestMiddleware.js";

const router = express.Router();

router
  .post("/register", validateRequestMiddleware(registerSchema), register)
  .post("/login"   , validateRequestMiddleware(loginSchema   ), login   )
  .get("/confirm-email/:token"   , confirmEmail)
  .post("/resend-confirmation-email", resendConfirmationEmail)
  .post("/logout"  , logout);

export default router;