import z from "zod";

const roles = ["USER", "ADMIN"];

const strongPasswordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character",
});

export const registerSchema = z.object({
  fullname:      z.string("Fullname must be a string"),
  username:      z.string("Username must be a string"),
  email:         z.email(),
  password:      strongPasswordSchema,
  role:          z.enum(roles, "Roles must be one of: USER, ADMIN").optional(),
  date_of_birth: z.coerce.date()
	.min(new Date("1900-01-01"), "Invalid date of birth, you can't really be that old"   )
	.max(new Date()            , "Invalid date of birth, you can't be born in the future"),
});

export const loginSchema = z.object({
  email:         z.email(),
  password_hash: z.string("Invalid password hash"),
});