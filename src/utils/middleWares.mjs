import { User } from "../mongoose/schemas/user.mjs";
import { mockedExercises, mockedUsers } from "./constants.mjs";
import mongoose from "mongoose";

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

export const resolveIndexByUserId = async (request, response, next) => {
  const { id } = request.params;

  console.log("ID: ", id)

  // Verificar se o ID é um ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).send({ error: "Invalid user ID format." });
  }

  try {
    // Buscar o usuário diretamente pelo ID no MongoDB
    const findUser = await User.findById(id);

    if (!findUser) {
      return response.status(404).send({ error: "User not found." });
    }

    // Adicionar o usuário encontrado à requisição para usar na próxima função
    request.user = findUser;
    next();
  } catch (error) {
    // Tratar qualquer erro que possa ocorrer durante a busca
    return response.status(500).send({ error: "Server error." });
  }
};
