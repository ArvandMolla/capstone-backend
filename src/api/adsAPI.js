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

adRouter.get("/", async (req, res, next) => {
  try {
    const data = await adModel.find();
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(200).send("no ad is available");
    }
  } catch (error) {
    next(createError(500, error));
  }
});

export default adRouter;
