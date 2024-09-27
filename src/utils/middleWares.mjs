import { mockedExercises, mockedUsers } from "./constants.mjs";

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

export const resolveIndexByUserId = (request, response, next) => {
  const { id } = request.params;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return response.sendStatus(400);
  }

  const findUserIndex = mockedUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) {
    return response.sendStatus(404);
  }

  request.findUserIndex = findUserIndex;
  next();
};
