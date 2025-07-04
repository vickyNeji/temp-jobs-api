import { StatusCodes } from "http-status-codes";

const routeNotFound = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    message: "Route does not exist",
  });
};

export default routeNotFound;
