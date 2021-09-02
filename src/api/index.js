import express from "express";
import videoRouter from "./videoUploader.js";
import analyzeRouter from "./videoAnalyzeAPI.js";
import textRouter from "./textAnalyzeAPI.js";
import adRouter from "./adsAPI.js";
import userRouter from "./usersAPI.js";

const allRouters = express.Router();

allRouters.use("/video", videoRouter);
allRouters.use("/video", analyzeRouter);
allRouters.use("/text", textRouter);
allRouters.use("/ad", adRouter);
allRouters.use("/user", userRouter);

export default allRouters;
