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
import { Exercise } from "../mongoose/schemas/exercise.mjs";

const router = Router();

function isAuthenticated(request, response, next) {
  if (request.isAuthenticated()) {
    return next();
  }
  return response.sendStatus(401);
}

// GET ALL EXERCISES
router.get(
  "/api/exercises",
  isAuthenticated,
  query("filter").isString().optional(),
  async (request, response) => {
    try {
      const { filter, value } = request.query;
      let exercises;

      if (filter && value) {
        const query = { [filter]: new RegExp(value, "i") }; // Case-insensitive search
        exercises = await Exercise.find(query);
      } else {
        exercises = await Exercise.find();
      }

      response.status(200).send(exercises);
    } catch (error) {
      response.status(500).send({ error: "Failed to retrieve exercises" });
    }
  }
);


router.get("/api/exercises/:id", isAuthenticated, async (request, response) => {
  const { id } = request.params;

  try {
    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return response.sendStatus(404);
    }

    return response.status(200).send(exercise);
  } catch (error) {
    return response.status(500).send({ error: "Failed to retrieve exercise" });
  }
});


router.post(
  "/api/exercises",
  isAuthenticated,
  checkSchema(createExerciseValidationSchema),
  async (request, response) => {
    const result = validationResult(request);

    // result.isEmpty() - return true if there is NO any error
    if (!result.isEmpty()) {
      return response.status(400).send({ errors: result.array() });
    }

    const data = matchedData(request);

    console.log("Deu matched data: ", data);

    try {
      const newExercise = new Exercise(data);
      await newExercise.save();
      return response.status(201).send(newExercise);
    } catch (error) {
      return response.status(500).send({ error: "Failed to create exercise" });
    }
  }
);

router.patch(
  "/api/exercises/:id",
  isAuthenticated,
  checkSchema(updateExerciseValidationSchema),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      return response.status(400).send({ errors: result.array() });
    }

    const data = matchedData(request);
    const { id } = request.params;

    try {
      const updatedExercise = await Exercise.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!updatedExercise) {
        return response.sendStatus(404);
      }

      return response.status(200).send(updatedExercise);
    } catch (error) {
      return response.status(500).send({ error: "Failed to update exercise" });
    }
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
