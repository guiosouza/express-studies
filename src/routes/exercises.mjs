import { Router } from "express";
import {
  validationResult,
  query,
  checkSchema,
  matchedData,
} from "express-validator";
import {
  createExerciseValidationSchema,
  updateExerciseValidationSchema,
} from "../utils/validationSchemas.mjs";
import { Exercise } from "../mongoose/schemas/exercise.mjs";
import { resolveExerciseById } from "../utils/middleWares.mjs";

const router = Router();

function isAuthenticated(request, response, next) {
  if (request.isAuthenticated()) {
    return next();
  }
  return response.sendStatus(401);
}

// GET ALL EXERCISES with optional title filter
router.get(
  "/api/exercises",
  isAuthenticated,
  query("title").optional().isString(), // Filtro por título é opcional
  async (request, response) => {
    try {
      const { title } = request.query;
      let exercises;

      // Se "title" for fornecido, faz uma busca com regex
      if (title) {
        const query = { title: new RegExp(title, "i") }; // Busca por correspondência parcial e case-insensitive
        exercises = await Exercise.find(query);
      } else {
        // Se "title" não for fornecido, busca todos os exercícios
        exercises = await Exercise.find();
      }

      response.status(200).send(exercises);
    } catch (error) {
      response.status(500).send({ error: "Failed to retrieve exercises" });
    }
  }
);


router.get("/api/exercises/:id", isAuthenticated, resolveExerciseById, (request, response) => {
  return response.status(200).send(request.exercise);
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
  "/api/exercises/:id",
  isAuthenticated,
  resolveExerciseById,
  async (request, response) => {
    try {
      await request.exercise.deleteOne(); // Deleta o exercício encontrado no middleware
      return response.sendStatus(200);
    } catch (error) {
      return response.status(500).send({ error: "Failed to delete exercise" });
    }
  }
);


export default router;
