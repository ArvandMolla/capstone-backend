import express from "express";
import { format } from "util";
import Multer from "multer";
import { Storage } from "@google-cloud/storage";
import analyzeLabelsGCS from "./analyze.js";
// const { format } = require("util");
// const express = require("express");
// const Multer = require("multer");
// const { Storage } = require("@google-cloud/storage");

const storage = new Storage();

const app = express();
app.set("view engine", "pug");

app.use(express.json());

const multer = Multer({
  storage: Multer.memoryStorage(),
  //   limits: {
  //     fileSize: 10 * 1024 * 1024,
  //   },
});

const bucket = storage.bucket("strive-proj");

app.post("/upload", multer.single("file"), (req, res, next) => {
  console.log("here");
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }
  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on("error", (err) => {
    next(err);
  });

  blobStream.on("finish", () => {
    const publicUrl = format(
      `https://storage.cloud.google.com/${bucket.name}/${blob.name}`
    );
    // res.status(200).send(publicUrl);

    const labelsAnalyzer = async () => {
      const data = await analyzeLabelsGCS(
        `gs://strive-proj/${req.file.originalname}`
      );
      res.send(data);
    };

    labelsAnalyzer();
  });

  blobStream.end(req.file.buffer);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
