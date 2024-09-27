import { Router } from "express";
import usersRouter from "../routes/users.mjs";
import exercisesRouter  from "../routes/exercises.mjs";

const router = Router();

router.use(usersRouter);
router.use(exercisesRouter);

export default router;
