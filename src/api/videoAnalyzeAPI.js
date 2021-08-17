import express from "express";
import analyzeLabelsGCS from "../util/analyzeLabelsGCS.js";
import analyzeVideoTranscription from "../util/analyzeTranscription.js";
import createError from "http-errors";

const analyzeRouter = express.Router();

analyzeRouter.post("/analyze/labels", async (req, res, next) => {
  console.log(req.body);
  if (!req.body) {
    next(createError(400, "there is no req body!"));
  } else {
    try {
      const url = req.body.randomFileName;
      const data = await analyzeLabelsGCS(`gs://strive-proj/${url}`);
      console.log("analysis completed");
      res.send(data);
    } catch (error) {
      next(createError(500, "Google api failed to response"));
    }
  }
});

analyzeRouter.post("/analyze/transcript", async (req, res, next) => {
  if (!req.body) {
    next(createError(400, "there is no req body!"));
  } else {
    try {
      const url = req.body.randomFileName;
      const data = await analyzeVideoTranscription(`gs://strive-proj/${url}`);
      console.log("analysis completed");
      res.send(data);
    } catch (error) {
      next(createError(500, "Google api failed to response"));
    }
  }
});

export default analyzeRouter;
