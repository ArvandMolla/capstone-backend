import jwt from "jsonwebtoken";
import createError from "http-errors";
import userModel from "../models/user.js";

export const JWTAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createError(401, "No authorization header was found!"));
  } else {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");

      const decodedToken = await verifyToken(token);

      const user = await userModel.findById(decodedToken._id);
      if (user) {
        req.user = user;
        next();
      } else {
        next(createError(404, "User not found!"));
      }
    } catch (error) {
      next(createError(401, "Token is not valid!"));
    }
  }
};

export const JWTAuth = async (user) => {
  const accessToken = await generateJWT({ _id: user._id });
  return accessToken;
};

const generateJWT = (payload) =>
  new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "90d" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });

const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        reject(err);
      } else {
        resolve(decodedToken);
      }
    });
  });
