import express from "express";
import cors from "cors";
import allRouters from "./api/index.js";
import { errorHandler } from "./util/errorHandler.js";
import mongoose from "mongoose";

const app = express();
app.set("view engine", "pug");

const whiteList = [
  process.env.FRONTEND_DEV_URL,
  process.env.FRONTEND_CLOUD_URL,
];
const corsOptions = {
  origin: function (origin, next) {
    console.log("ORIGIN ", origin);
    if (whiteList.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error("CORS TROUBLES!!!!!"));
    }
  },
};

// middlewares ***********************
app.use(express.json());
app.use(cors(corsOptions));
// routers ****************************
app.use("/api", allRouters);
// errorHandlers **********************
app.use(errorHandler);

const port = process.env.PORT;

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(
    app.listen(port, () => {
      console.log("✅✅✅ Running on port", port);
    })
  )
  .catch((err) => console.log(err));
