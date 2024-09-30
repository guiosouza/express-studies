import passport from "passport";
import { Strategy } from "passport-local";
import { mockedUsers } from "../utils/constants.mjs";

passport.serializeUser((user, done) => {
  console.log("Inside serializedUser");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("Inside deserializeUser");
  console.log("deserializedUser user ID: ", id);
  try {
    const findUser = mockedUsers.find((user) => user.id === id);
    if (!findUser) {
      throw new Error("User not found");
    }
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy((username, password, done) => {
    console.log("Username: ", username);
    console.log("Password: ", password);
    try {
      const findUser = mockedUsers.find((user) => user.username === username);
      if (!findUser) {
        throw new Error("User not found");
      }
      if (findUser.password !== password) {
        throw new Error("Invalid credentials");
      }
      done(null, findUser);
    } catch (error) {
      done(error, null);
    }
  })
);
