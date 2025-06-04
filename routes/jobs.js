import express from "express";
import jobsController from "../controllers/jobs.js";

const { getAllJobs, getSingleJob, createJob, updateJob, deleteJob } =
  jobsController;

const router = express.Router();

router.route("/").get(getAllJobs);

router.route("/").post(createJob);

router.route("/:jobId").get(getSingleJob);

router.route("/:jobId").delete(deleteJob);

router.route("/:jobId").patch(updateJob);

export default router;
