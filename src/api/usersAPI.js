import express from "express";
import userModel from "../models/user.js";
import createError from "http-errors";
import { JWTAuth, JWTAuthMiddleware } from "../auth/jwt.js";

const userRouter = express.Router();

userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.checkCredentials(email, password);
    console.log(user);

    if (user) {
      const accessToken = await JWTAuth(user);
      res.send({ accessToken });
    } else {
      next(createError(401, "credentials are not correct!"));
    }
  } catch (error) {
    next(createError(500));
  }
});

userRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new userModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(createError(500), error);
  }
});

userRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const data = await userModel.find();
    res.send(data);
  } catch (error) {
    next(createError(500, error));
  }
});

export default userRouter;
