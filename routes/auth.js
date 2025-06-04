import express from "express";
import authController from "../controllers/auth.js";

const { register, login } = authController;

const router = express.Router();

router.route("/login").post(login);

router.route("/register").post(register);

export default router;
