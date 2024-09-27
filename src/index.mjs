import express from "express";
import dotenv from "dotenv";
import { query, validationResult, body, matchedData } from "express-validator";
import { checkSchema } from "express-validator";
import { createExerciseValidationSchema, updateExerciseValidationSchema } from "./utils/validationSchemas.mjs";

// loading .env
dotenv.config();

const app = express();

const logginMiddleware = (request, reponse, next) => {
  console.log(`${request.method} - ${request.url}`);
  next();
};

app.use(logginMiddleware);

app.use(express.json());

const PORT = process.env.PORT || 5555;

const mockedExercises = [
  { id: 1, title: "Push-up", description: "Flexão." },
  { id: 2, title: "squat", description: "Agachamento." },
  {
    id: 3,
    title: "bent-over row",
    description:
      "Remada curvada. Exercício para as costas realizado com halteres ou barra, no qual o praticante mantém uma posição inclinada com o tronco quase paralelo ao chão e puxa o peso em direção ao abdômen, elevando os cotovelos enquanto mantém as costas retas.",
  },
];

const mockedUsers = [
  { id: 1, username: "guios", email: "guilherme@gmail.com" },
  { id: 2, username: "aldivio", email: "aldivio@gmail.com" },
  { id: 3, username: "gus", email: "gustavo@gmail.com" },
];

// MIDDLEWARE
const resolveIndexByExerciseId = (request, response, next) => {
  const {
    body,
    params: { id },
  } = request;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return response.sendStatus(400);
  }

  const findExerciseIndex = mockedExercises.findIndex(
    (exercise) => exercise.id === parsedId
  );

  if (findExerciseIndex === -1) {
    return response.sendStatus(404);
  }

  request.findExerciseIndex = findExerciseIndex;
  next();
};

// ROOT
app.get("/", (request, response) => {
  response.status(201).send({ message: "Hello there" });
});

// GET ALL USERS
app.get("/api/users", (request, response) => {
  response.send(moeckedUsers);
});

// POST USER
app.post("/api/users", (request, response) => {
  console.log(request.body);
  const { body } = request;
  const newUser = { id: mockedUsers[mockedUsers.length - 1].id + 1, ...body };
  mockedUsers.push(newUser);
  return response.status(201).send(newUser);
});

// GET ALL EXERCISES
app.get(
  "/api/exercises",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (request, response) => {
    console.log(request);
    const {
      query: { filter, value },
    } = request;

    if (filter && value) {
      response.send(
        mockedExercises.filter((exercise) => exercise[filter].includes(value))
      );
    }

    return response.send(mockedExercises);
  }
);

// POST EXERCISE
app.post(
  "/api/exercises",
  checkSchema(createExerciseValidationSchema),
  (request, response) => {
    const result = validationResult(request);
    console.log("result", result);
    // result.isEmpty() - return true if there is NO any error
    if (!result.isEmpty()) {
      return response.status(400).send({ errors: result.array() });
    }

    const data = matchedData(request);

    const newExercise = {
      id: mockedExercises[mockedExercises.length - 1].id + 1,
      ...data,
    };
    mockedExercises.push(newExercise);
    return response.status(201).send(newExercise);
  }
);

// GET ONE EXERCISE
app.get("/api/exercises/:id", resolveIndexByExerciseId, (request, response) => {
  const { findExerciseIndex } = request;

  const findExercise = mockedExercises[findExerciseIndex];

  if (!findExercise) {
    return response.sendStatus(404);
  }

  return response.send(findExercise);
});

// PUT EXERCISE
app.put(
  "/api/exercises/:id",
  resolveIndexByExerciseId,
  checkSchema(createExerciseValidationSchema),
  (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      return response.status(400).send({ errors: result.array() });
    }

    const data = matchedData(request);
    const { findExerciseIndex } = request;

    mockedExercises[findExerciseIndex] = {
      id: mockedExercises[findExerciseIndex].id,
      ...data,
    };

    return response.sendStatus(200);
  }
);

// PATCH EXERCISE
app.patch(
  "/api/exercises/:id",
  resolveIndexByExerciseId,
  checkSchema(updateExerciseValidationSchema),  // Validação no PATCH
  (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      return response.status(400).send({ errors: result.array() });
    }

    const data = matchedData(request);
    const { findExerciseIndex } = request;

    mockedExercises[findExerciseIndex] = {
      ...mockedExercises[findExerciseIndex],
      ...data,
    };

    return response.sendStatus(200);
  }
);

// DELETE EXERCISE
app.delete(
  `/api/exercises/:id`,
  resolveIndexByExerciseId,
  (request, response) => {
    const { findExerciseIndex } = request;

    mockedExercises.splice(findExerciseIndex, 1);

    return response.sendStatus(200);
  }
);

app.listen(PORT, () => {
  console.log("Running on port: " + PORT);
});
