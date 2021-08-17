import express from "express";
import adModel from "../models/ad.js";

import createError from "http-errors";

const adRouter = express.Router();

adRouter.post("/post", async (req, res, next) => {
  try {
    const newAd = new adModel(req.body);
    const createdAd = await newAd.save();
    res.status(201).send(createdAd);
  } catch (error) {
    next(createError(400, error));
  }
});

export default adRouter;
