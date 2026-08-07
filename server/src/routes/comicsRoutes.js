import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createComic,
  getAllComics,
  updateComic,
} from "../controllers/comicsController.js";
import { Role } from "../generated/prisma/enums.ts";
import { validateRequestMiddleware } from "../middlewares/validateRequestMiddleware.js";
import { createComicValidator, updateComicValidator } from "../validators/comicsValidators.js";

const router = express.Router();

router
  .get("/", authMiddleware(Role.USER, false), getAllComics)
  .post(
    "/",
    authMiddleware(Role.ADMIN, true),
    validateRequestMiddleware(createComicValidator),
    createComic,
  )
  .patch(
    "/:id",
    authMiddleware(Role.ADMIN, true),
    validateRequestMiddleware(updateComicValidator),
    updateComic,
  );

export default router;
