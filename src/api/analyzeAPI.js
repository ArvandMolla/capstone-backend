import express from "express";
import analyzeLabelsGCS from "../util/analyzeLabelsGCS.js";

const analyzeRouter = express.Router();

analyzeRouter.post("/analyze/labels", async (req, res, next) => {
  console.log(req.body);
  if (!req.body) {
    console.log("there is no req body!");
  } else {
    const url = req.body.randomFileName;
    const data = await analyzeLabelsGCS(`gs://strive-proj/${url}`);
    console.log("analysis completed");
    res.send(data);
  }
});

export default analyzeRouter;
