import express from "express"
import { getAllRatings } from "../controllers/comicRatingsController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js"
import { Role } from "../generated/prisma/enums.js";

const router = express.Router();

router.get("/", authMiddleware(Role.USER, false), getAllRatings);

export default router;