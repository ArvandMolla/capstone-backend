import mongoose from "mongoose";
import { commentSchema } from "./comment.js";

const { Schema, model } = mongoose;

const adSchema = new Schema(
  {
    title: { type: String, required: true },
    transcript: { type: String },
    brand: { type: String },
    videoUrl: { type: String, required: true },
    labels: { type: [String] },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    comments: {
      type: [commentSchema],
      default: [],
      required: true,
    },
  },

  { timestamps: true }
);

export default model("Ad", adSchema);
