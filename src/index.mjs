import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockedUsers } from "./utils/constants.mjs";

// loading .env
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser("helloWorld"));
app.use(
  session({
    secret: "Gui the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);
app.use(routes);

const PORT = process.env.PORT || 5555;

app.listen(PORT, () => {
  console.log("Running on port: " + PORT);
});

app.get("/", (request, response) => {
  console.log("request.session :", request.session);
  console.log("request.session.id :", request.session.id);

  request.session.visited = true;

  response.cookie("hello", "world", { maxAge: 3600000, signed: true });
  response.status(201).send({ message: "Hello there" });
});

app.post("/api/auth", (request, response) => {
  const {
    body: { username, password },
  } = request;
  const findUser = mockedUsers.find((user) => user.username === username);

  if (!findUser || findUser.password !== password) {
    return response.status(401).send({ message: "BAD CREDENTIALS" });
  }

  request.session.user = findUser;

  console.log("request.session: ", request.session);

  return response.status(200).send(findUser);
});

app.get("/api/auth/status", (request, response) => {
  request.sessionStore.get(request.sessionID, (error, session) => {
    console.log("session in status: ", session);
  });
  return request.session.user
    ? response.status(200).send(request.session.user)
    : response.status(401).send({ message: "Not Authenticated" });
});

app.post("/api/cart", (request, response) => {
  if (!request.session.user) {
    response.sendStatus(401);
  }

  const { body: item } = request;

  const { cart } = request.session;

  if (cart) {
    cart.push(item);
  } else {
    request.session.cart = [item];
  }

  return response.status(201).send(item);
});

app.get("/api/cart", (request, response) => {
  if (!request.session.user) {
    response.sendStatus(401);
  }

  return response.send(request.session.cart ?? []);
});
