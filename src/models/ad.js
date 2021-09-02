import mongoose from "mongoose";

const { Schema, model } = mongoose;

const adSchema = new Schema(
  {
    title: { type: String, required: true },
    transcript: { type: String },
    brand: { type: String },
    videoUrl: { type: String, required: true },
    labels: { type: [String] },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },

  { timestamps: true }
);

export default model("Ad", adSchema);
