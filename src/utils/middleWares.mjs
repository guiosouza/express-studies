  import { Exercise } from "../mongoose/schemas/exercise.mjs";
  import { User } from "../mongoose/schemas/user.mjs";
  import mongoose from "mongoose";

  export const resolveExerciseById = async (request, response, next) => {
    const { id } = request.params;

    // Verificar se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).send({ error: "Invalid exercise ID format." });
    }

    try {
      // Buscar o exercício pelo ID no MongoDB
      const exercise = await Exercise.findById(id);

      if (!exercise) {
        return response.status(404).send({ error: "Exercise not found." });
      }

      // Adicionar o exercício encontrado à requisição para ser utilizado na próxima função
      request.exercise = exercise;
      next();
    } catch (error) {
      return response.status(500).send({ error: "Server error." });
    }
  };

  export const resolveIndexByUserId = async (request, response, next) => {
    const { id } = request.params;

    console.log("ID: ", id);

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
