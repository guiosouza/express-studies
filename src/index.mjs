import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";

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
  const { body } = request;
});
