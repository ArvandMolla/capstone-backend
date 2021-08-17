import express from "express";
import analyzeEntitiesOfText from "../util/analyzeTextEntities.js";
import createError from "http-errors";

const textRouter = express.Router();

textRouter.post("/analyze/entities", async (req, res, next) => {
  try {
    const text = req.body.text;
    const data = await analyzeEntitiesOfText(text);
    if (data) {
      res.status(200).send(data);
    } else {
      throw new Error("no data is back!");
    }
  } catch (error) {
    next(createError(error));
  }
});

export default textRouter;
