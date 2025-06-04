import User from "../models/User.js";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import BadRequestError from "../errors/bad-request.js";
import UnauthenticatedError from "../errors/unauthenticated.js";

dotenv.config();

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide both email and password");
    // return res.status(StatusCodes.BAD_REQUEST).json({
    //   message: "Please provide email and password",
    // });
  }

  const user = await User.findOne({ email });
  if (user) {
    // can use like this or as in schema
    //const isPasswordMatch = await bcrypt.compare(password, user.password);
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new UnauthenticatedError("Incorrect password");
    } else {
      const token = user.createJWT();
      res.send({
        message: `Welcome ${user.name}`,
        data: {
          token,
          userDetails: {
            name: user.name,
            email: user.email,
          },
        },
      });
    }
  } else {
    res.send("User not found");
  }
};

const register = async (req, res) => {
  // const { name, email, password } = req.body;
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);

  // //console.log(hashedPassword);
  // const tempUser = { name, email, password: hashedPassword };
  const user = await User.create(req.body);

  // WE CAN DO IT LIKE THIS OR USE METHOD MENTIONED IN SCHEMA FILE

  // const token = jwt.sign(
  //   { userId: user._id, name: user.name },
  //   process.env.JWT_SECRET,
  //   {
  //     expiresIn: "30d",
  //   }
  // );
  //console.log(token);

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    message: "User registered Successfully",
    data: {
      token: token,
      user: {
        name: user.name,
        email: user.email,
      },
    },
  });
};

export default { register, login };
