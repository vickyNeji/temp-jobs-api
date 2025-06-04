import express from "express";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import routeNotFound from "./middle-ware/route_not_found.js";
import errorHanlder from "./middle-ware/error-handler.js";
import authenticateUser from "./middle-ware/authentication.js";
import connect from "./db/connect.js";

// extra security packages
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

// routes

import jobRouter from "./routes/jobs.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(express.json());
app.use(helmet());
app.use(cors());

app.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({
    message: "It worked",
  });
});

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/jobs", authenticateUser, jobRouter);

app.use(routeNotFound);

app.use(errorHanlder);

const start = async () => {
  try {
    await connect(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log("server running");
    });
  } catch (error) {}
};

start();
