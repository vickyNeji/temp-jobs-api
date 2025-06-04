import { StatusCodes } from "http-status-codes";
import Job from "../models/Job.js";

const getAllJobs = async (req, res) => {
  const userId = req.user.userId;
  const jobs = await Job.find({ createdBy: userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({
    message: "Jobs Fetched successfully",
    data: jobs,
    count: jobs.length,
  });
};

const getSingleJob = async (req, res) => {
  console.log(req.params);
  const job = await Job.findOne({
    _id: req.params.jobId,
    createdBy: req.user.userId,
  });
  if (!job) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid job id",
    });
  }

  return res.status(StatusCodes.OK).json({
    message: "Job fetched sucessfully",
    data: job,
  });
};

const createJob = async (req, res) => {
  //const tempUser = req.body;
  //tempUser.createdBy = req.user.userId;
  //const job = await Job.create(tempUser);

  // can do it like this
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({
    message: "Job created",
    data: job,
  });
};

const updateJob = async (req, res) => {
  if (req.body.company == "" || req.body.position == "") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide valid fields",
    });
  }

  const jobId = req.params.jobId;
  req.body.createdBy = req.user.userId;
  const job = await Job.findOneAndUpdate(
    {
      _id: jobId,
      createdBy: req.user.userId,
    },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid job id provided",
    });
  }

  return res.status(StatusCodes.OK).json({
    message: "Job updated successfully",
    data: job,
  });
};

const deleteJob = async (req, res) => {
  const jobId = req.params.jobId;
  const job = await Job.findOneAndDelete({
    _id: jobId,
    createdBy: req.user.userId,
  });

  if (!job) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid id",
    });
  }

  return res.status(StatusCodes.OK).json({
    message: "Job deleted successfully",
  });
};

export default { getAllJobs, getSingleJob, updateJob, createJob, deleteJob };
