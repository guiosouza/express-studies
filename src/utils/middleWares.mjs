import { mockedExercises } from "./constants.mjs";

export const resolveIndexByExerciseId = (request, response, next) => {
  const {
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
