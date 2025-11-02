import express from "express";
import { login, seedUsers } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/seed", seedUsers); // Dev only

export default router;
