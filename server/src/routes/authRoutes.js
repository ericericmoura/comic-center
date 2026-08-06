import express from "express"
import { confirmEmail, login, logout, register, resendConfirmationEmail } from "../controllers/authController.js";
import { loginSchema, registerSchema, resendEmailConfirmationSchema } from "../validators/authValidators.js";
import { validateRequestMiddleware } from "../middlewares/validateRequestMiddleware.js";

const router = express.Router();

router
  .post("/register", validateRequestMiddleware(registerSchema), register)
  .post("/login"   , validateRequestMiddleware(loginSchema   ), login   )
  .post("/resend-confirmation-email", validateRequestMiddleware(resendEmailConfirmationSchema), resendConfirmationEmail)
  .post("/logout"  , logout)
  .get ("/confirm-email/:token", confirmEmail);

export default router;