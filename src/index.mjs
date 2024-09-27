import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.mjs";

// loading .env
dotenv.config();

const app = express();
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 5555;

app.listen(PORT, () => {
  console.log("Running on port: " + PORT);
});

app.get("/", (request, response) => {
  response.status(201).send({ message: "Hello there" });
});
