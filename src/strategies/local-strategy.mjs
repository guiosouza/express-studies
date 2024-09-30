import passport from "passport";
import { Strategy } from "passport-local";
import { mockedUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { compareSync } from "bcrypt";
import { comparePassword } from "../utils/helpers.mjs";

passport.serializeUser((user, done) => {
  console.log("Inside serializedUser");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Inside deserializeUser");
  console.log("deserializedUser user ID: ", id);
  try {
    const findUser = await User.findById(id);
    if (!findUser) {
      throw new Error("User not found");
    }
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username: username });
      if (!findUser) {
        throw new Error("User not found");
      }
      if (!comparePassword(password, findUser.password)) {
        throw new Erro("Bad credentials");
      }
      done(null, findUser);
    } catch (error) {
      done(error, null);
    }
  })
);
