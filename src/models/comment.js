import mongoose from "mongoose";
const { Schema, model } = mongoose;

export const commentSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    content: { type: String },
  },
  { timestamps: true }
);
