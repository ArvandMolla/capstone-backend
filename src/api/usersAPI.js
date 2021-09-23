import express from "express";
import userModel from "../models/user.js";
import createError from "http-errors";
import { JWTAuth, JWTAuthMiddleware } from "../auth/jwt.js";
import passport from "passport";

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

userRouter.get("/is-loggedin", JWTAuthMiddleware, async (req, res, next) => {
  try {
    if (req.user) {
      res.status(200).send(true);
    }
  } catch (error) {
    next(createError(error));
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

// Google Login

userRouter.get(
  "/google-login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRouter.get(
  "/google-redirect",
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
      // res.cookie("token", req.user.token, { httpOnly: true });
      res
        .status(200)
        .redirect(
          `${process.env.FRONTEND_CLOUD_URL}/from-google?${req.user.token}`
        );
    } catch (error) {
      next(error);
    }
  }
);

export default userRouter;
