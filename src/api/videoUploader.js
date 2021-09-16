import Multer from "multer";
import { Storage } from "@google-cloud/storage";
import { format } from "util";
import uniqid from "uniqid";
import express from "express";
import createError from "http-errors";

const videoRouter = express.Router();

const storage = new Storage();

const multer = Multer({
  storage: Multer.memoryStorage(),
  //   limits: {
  //     fileSize: 10 * 1024 * 1024,
  //   },
});

const bucket = storage.bucket("strive-proj");

videoRouter.post("/upload", multer.single("video"), (req, res, next) => {
  console.log("try to upload ...");
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }
  const randomFileName = "vid-" + uniqid() + ".mp4";
  const blob = bucket.file(randomFileName);
  const blobStream = blob.createWriteStream();

  blobStream.on("error", (err) => {
    next(err);
  });

  blobStream.on("finish", () => {
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );
    res.status(200).send({ publicUrl, randomFileName });
    console.log("video uploaded successfully");
  });

  blobStream.end(req.file.buffer);
});

export default videoRouter;
