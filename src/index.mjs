import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./strategies/local-strategy.mjs";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

// loading .env
dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO_URI || "mongodb://root:example@localhost:27017")
  .then(() => console.log("Connected to the database!"))
  .catch((error) => console.log(error));

app.use(express.json());
app.use(cookieParser("helloWorld"));
app.use(
  session({
    secret: "Gui the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60 * 24 * 2,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.post("/api/auth", passport.authenticate("local"), (request, response) => {
  response.status(200).json({ message: "Usuário logado com sucesso!" });
});

app.get("/api/auth/status", (request, response) => {
  console.log("Inside /auth/status");
  console.log(request.user);
  console.log(request.session);
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

app.post("/api/auth/logout", (request, response) => {
  if (!request.user) {
    response.sendStatus(401);
  }

  request.logout((error) => {
    if (error) {
      return response.sendStatus(400);
    }
    return response.send(200);
  });
});

const PORT = process.env.PORT || 5555;

app.listen(PORT, () => {
  console.log("Running on port: " + PORT);
});
