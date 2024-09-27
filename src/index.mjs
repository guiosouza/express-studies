import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";

// loading .env
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser('helloWorld'));
app.use(routes);

const PORT = process.env.PORT || 5555;

app.listen(PORT, () => {
  console.log("Running on port: " + PORT);
});

app.get("/", (request, response) => {
  response.cookie("hello", "world", { maxAge: 30000, signed: true });
  response.status(201).send({ message: "Hello there" });
});
