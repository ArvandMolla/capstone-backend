import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import userModel from "../models/user.js";
import { JWTAuth } from "./jwt.js";

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:5000/api/user/google-redirect",
    },
    async (accessToken, refreshToken, profile, next) => {
      try {
        const user = await userModel.findOne({ googleId: profile.id });

        if (user) {
          const token = await JWTAuth(user);
          next(null, { user, token });
        } else {
          const newUser = {
            name: profile.displayName,
            email: profile._json.email,
            googleId: profile.id,
            avatar: profile._json.picture,
          };

          const createdUser = new userModel(newUser);
          const savedUser = await createdUser.save();
          const token = await JWTAuth(savedUser);
          next(null, { savedUser, token });
        }
      } catch (error) {
        next(error);
      }
    }
  )
);

passport.serializeUser(function (user, next) {
  next(null, user);
});

export default {};
