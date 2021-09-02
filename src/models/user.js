import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const newUser = this;
  const plainPw = newUser.password;
  if (newUser.isModified("password")) {
    newUser.password = await bcrypt.hash(plainPw, 10);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

userSchema.statics.checkCredentials = async function (email, plainPw) {
  const user = await this.findOne({ email });
  if (user) {
    const hashedPw = user.password;
    const isMatch = await bcrypt.compare(plainPw, hashedPw);
    if (isMatch) {
      return user;
    } else {
      return null;
    }
  }
};

export default model("User", userSchema);
