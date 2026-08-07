import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createComic, deleteComic, getAllComics, updateComic } from "../controllers/comicsController.js";
import { Role } from "../generated/prisma/enums.ts";
import { validateRequestMiddleware } from "../middlewares/validateRequestMiddleware.js";
import { createComicValidator } from "../validators/comicsValidators.js";

const router = express.Router();

router
  .get("/", authMiddleware(Role.USER, false), getAllComics)
  .post(
    "/",
    authMiddleware(Role.ADMIN, true),
    validateRequestMiddleware(createComicValidator),
    createComic,
  )
  .put("/:id", authMiddleware(Role.ADMIN, true), updateComic)
  .delete("/:id", authMiddleware(Role.ADMIN, true), deleteComic);

export default router;