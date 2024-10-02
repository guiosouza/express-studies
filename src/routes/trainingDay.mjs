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