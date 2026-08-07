import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createComic, deleteComic, getAllComics, updateComic } from "../controllers/comicsController.js";
import { Role } from "../generated/prisma/enums.js";

const router = express.Router();

router.get   ("/"   , authMiddleware(Role.USER, false), getAllComics)
      .post  ("/"   , authMiddleware(Role.USER, true ), createComic )
      .put   ("/:id", authMiddleware(Role.USER, true),  updateComic )
      .delete("/:id", authMiddleware(Role.USER, true),  deleteComic )

export default router;