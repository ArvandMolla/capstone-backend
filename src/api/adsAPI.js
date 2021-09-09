import express from "express";
import adModel from "../models/ad.js";
import createError from "http-errors";
import q2m from "query-to-mongo";
import { JWTAuthMiddleware } from "../auth/jwt.js";

const adRouter = express.Router();

adRouter.post("/post", JWTAuthMiddleware, async (req, res, next) => {
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
    const skipCalculator = () => {
      if (req.query.page) {
        return (req.query.page - 1) * 8;
      } else {
        return "";
      }
    };

    const data = await adModel
      .find()
      .sort({ updatedAt: -1 })
      .skip(skipCalculator())
      .limit(8);
    const total = await adModel.countDocuments();

    if (data) {
      res.status(200).send({ total, data });
    } else {
      res.status(404).send("no ad is available");
    }
  } catch (error) {
    next(createError(500, error));
  }
});

adRouter.get("/details/:id", async (req, res, next) => {
  try {
    const data = await adModel.findById(req.params.id);
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(404).send("ad not found!");
    }
  } catch (error) {
    next(createError(500, error));
  }
});

adRouter.get("/result", async (req, res, next) => {
  try {
    const skipCalculator = () => {
      if (req.query.page) {
        return (req.query.page - 1) * 8;
      } else {
        return "";
      }
    };
    const query = q2m(req.query);

    let criteria = {};
    if (req.query.search) {
      criteria.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { transcript: { $regex: req.query.search, $options: "i" } },
      ];
    }
    if (req.query.labels) {
      criteria.labels = {
        $all: req.query.labels.split(","),
      };
    }
    if (req.query.brand) {
      criteria.brand = query.criteria.brand;
    }

    const data = await adModel
      .find(criteria)
      .sort({ updatedAt: -1 })
      .skip(skipCalculator())
      .limit(8);

    const total = await adModel.countDocuments(criteria);

    res.send({ total, links: query.links("/result", total), data });
  } catch (error) {
    next(createError(500, error));
  }
});

export default adRouter;
