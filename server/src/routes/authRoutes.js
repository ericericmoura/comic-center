import express from "express"
import { confirmEmail, forgotPassword, login, logout, register, resendConfirmationEmail, resetPassword, resetPasswordForm } from "../controllers/authController.js";
import { loginSchema, registerSchema, resendEmailConfirmationSchema, resetPasswordSchema } from "../validators/authValidators.js";
import { validateRequestMiddleware } from "../middlewares/validateRequestMiddleware.js";
import z from "zod";

const router = express.Router();

router
  .post("/register", validateRequestMiddleware(registerSchema), register)
  .post("/login"   , validateRequestMiddleware(loginSchema   ), login   )
  .post("/logout"  , logout)

  .post("/resend-confirmation-email", validateRequestMiddleware(resendEmailConfirmationSchema), resendConfirmationEmail)
  .get ("/confirm-email/:token"     , confirmEmail)
  
  .post("/forgot-password"      , validateRequestMiddleware(z.object({email: z.email()})), forgotPassword)
  .post("/reset-password"       , validateRequestMiddleware(resetPasswordSchema)         , resetPassword)
  .get ("/reset-password/:token", resetPasswordForm)

export default router;