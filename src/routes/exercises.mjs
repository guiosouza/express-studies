import { Router } from "express";
import {
  validationResult,
  query,
  checkSchema,
  matchedData,
} from "express-validator";
import { mockedExercises } from "../utils/constants.mjs";
import {
  createExerciseValidationSchema,
  updateExerciseValidationSchema,
} from "../utils/validationSchemas.mjs";
import { resolveIndexByExerciseId } from "../utils/middleWares.mjs";

const router = Router();

router.get(
  "/api/exercises",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (request, response) => {
    const result = validationResult(request);
    console.log(result);
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

router.get(
  "/api/exercises/:id",
  resolveIndexByExerciseId,
  (request, response) => {
    const { findExerciseIndex } = request;

    const findExercise = mockedExercises[findExerciseIndex];

    if (!findExercise) {
      return response.sendStatus(404);
    }

    return response.send(findExercise);
  }
);

router.post(
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

    console.log("Deu matched data: ", data);

    const newExercise = {
      id: mockedExercises[mockedExercises.length - 1].id + 1,
      ...data,
    };
    mockedExercises.push(newExercise);
    return response.status(201).send(newExercise);
  }
);

router.put(
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

router.patch(
  "/api/exercises/:id",
  resolveIndexByExerciseId,
  checkSchema(updateExerciseValidationSchema), // Validação no PATCH
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

router.delete(
  `/api/exercises/:id`,
  resolveIndexByExerciseId,
  (request, response) => {
    const { findExerciseIndex } = request;

    mockedExercises.splice(findExerciseIndex, 1);

    return response.sendStatus(200);
  }
);

export default router;
