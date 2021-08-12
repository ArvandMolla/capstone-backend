import express from "express";
import videoRouter from "./GCSuploader.js";
import analyzeRouter from "./analyzeAPI.js";

const allRouters = express.Router();

allRouters.use("/video", videoRouter);
allRouters.use("/video", analyzeRouter);

export default allRouters;
