import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getAllComics } from "../controllers/comicsController.js";

const router = express.Router();

router.get("/", getAllComics)

export default router;