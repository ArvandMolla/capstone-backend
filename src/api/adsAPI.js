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
      .sort({ createdAt: -1 })
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
    const data = await adModel.findById(req.params.id).populate("user");
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
      .sort({ createdAt: -1 })
      .skip(skipCalculator())
      .limit(8);

    const total = await adModel.countDocuments(criteria);

    res.send({ total, links: query.links("/result", total), data });
  } catch (error) {
    next(createError(500, error));
  }
});

// Comments

//Getting all comments of an ad
adRouter.get("/:id/comments", async (req, res, next) => {
  try {
    const ad = await adModel.findById(req.params.id).populate({
      path: "comments",
      populate: {
        path: "sender",
        model: "User",
      },
    });

    if (ad) {
      res.status(200).send(ad.comments);
    } else {
      next(createError(404, "ad id not found!"));
    }
  } catch (error) {
    next(createError(500, error));
  }
});

//Adding a new comment to an ad
adRouter.put("/:id/new-comment", async (req, res, next) => {
  try {
    const ad = await adModel.findById(req.params.id);
    let comments = ad.comments;
    const newComments = [...comments, req.body];

    const newAdObj = {
      title: ad.title,
      transcript: ad.transcript,
      brand: ad.brand,
      videoUrl: ad.videoUrl,
      labels: ad.labels,
      user: ad.user,
      comments: newComments,
      createdAt: ad.createdAt,
      updatedAt: ad.updatedAt,
    };

    const newAd = await adModel.findByIdAndUpdate(req.params.id, newAdObj, {
      new: true,
    });

    res.status(200).send(newAd);
  } catch (error) {
    next(createError(500, error));
  }
});

//Removing a comment from an ad: the comment Id is comming in the req body
adRouter.put("/:id/delete-comment", async (req, res, next) => {
  try {
    const ad = await adModel.findById(req.params.id);
    let oldComments = ad.comments;
    let newComments = oldComments.filter((elem) => elem._id != req.body.id);
    let finalComments = [];

    if (newComments.length > 0) {
      newComments.forEach((elem) => {
        if (!elem.replyTo) {
          finalComments.push(elem);
        } else {
          newComments.forEach((elem2) => {
            if (elem.replyTo === elem2._id) {
              finalComments.push(elem);
            }
          });
        }
      });
    }

    const newAdObj = {
      title: ad.title,
      transcript: ad.transcript,
      brand: ad.brand,
      videoUrl: ad.videoUrl,
      labels: ad.labels,
      user: ad.user,
      comments: finalComments,
    };

    const newAd = await adModel.findByIdAndUpdate(req.params.id, newAdObj, {
      new: true,
    });

    res.status(200).send(newAd);
  } catch (error) {
    next(createError(500, error));
  }
});

export default adRouter;
