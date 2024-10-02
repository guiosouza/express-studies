import { Router } from "express";
import {
  validationResult,
  checkSchema,
  matchedData,
  query,
} from "express-validator";
import { mockedUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middleWares.mjs";
import {
  createUserValidationSchema,
  updateUserValidationSchema,
} from "../utils/validationSchemas.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";
import { createUserHandler, getUserByIdHandler } from "../handlers/users.mjs";

const router = Router();

// GET ALL USERS
router.get(
  "/api/users",
  query("filter")
    .optional()
    .isString()
    .withMessage("Must be a string")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be between 3-10 characters"),
  async (request, response) => {
    try {
      // Verifica se o usuário está autenticado
      if (!request.user) {
        return response.sendStatus(401); // Não autorizado
      }

      // Obtém o filtro e o valor da query
      const { filter, value } = request.query;

      // Inicializa o objeto query
      let query = {};

      // Se houver filtro e valor, aplica o filtro na query
      if (filter && value) {
        if (filter === "username") {
          query.username = { $regex: value, $options: "i" };
        } else if (filter === "displayName") {
          query.displayName = { $regex: value, $options: "i" };
        } else {
          return response.status(400).send({
            message:
              "Invalid filter. Supported filters are 'username' and 'displayName'.",
          });
        }

        // Busca os usuários filtrados
        const users = await User.find(query);

        if (users.length === 0) {
          return response.status(404).send({
            message: "No users found for the given filter.",
          });
        }

        // Retorna os usuários encontrados
        return response.json(users);
      } else {
        // Se não houver filtro, retorna todos os usuários
        const users = await User.find();
        return response.json(users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return response.status(500).send("Internal server error");
    }
  }
);

// GET USER BY ID
router.get("/api/users/:id", resolveIndexByUserId, getUserByIdHandler);

// CREATE USER
router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  createUserHandler
);

// PARTIAL UPDATE USER (PATCH)
router.patch(
  "/api/users/:id",
  resolveIndexByUserId,
  checkSchema(updateUserValidationSchema),
  async (request, response) => {
    const result = validationResult(request);

    console.log("result: ", result);

    if (!result.isEmpty()) {
      return response.status(400).send({ errors: result.array() });
    }

    let data = matchedData(request); // Validated data
    const user = request.user; // User found by the middleware

    if (data.password) {
      data.password = hashPassword(data.password);
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(user._id, data, {
        new: true, // Retorn the document updated
        runValidators: true, // Apply the schema validations
      });

      if (!updatedUser) {
        return response.status(404).send({ error: "User not found." });
      }

      return response.status(200).send(updatedUser);
    } catch (error) {
      return response.status(500).send({ error: "Error updating user." });
    }
  }
);

// DELETE USER
router.delete(
  "/api/users/:id",
  resolveIndexByUserId,
  async (request, response) => {
    try {
      // Usuário já foi encontrado no middleware resolveIndexByUserId
      const user = request.user;

      // Verifica se o usuário está autenticado
      if (!request.user) {
        return response.sendStatus(401); // Não autorizado
      }

      // Exclui o usuário do banco de dados
      await User.findByIdAndDelete(user._id);

      return response
        .status(200)
        .json({ message: `User ${user.username} was successfully deleted.` });
    } catch (error) {
      console.error("Error deleting user:", error);
      return response.status(500).json({ error: "Error deleting user." });
    }
  }
);

export default router;
