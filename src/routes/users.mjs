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

// UPDATE USER (PUT)
router.put(
  "/api/users/:id",
  resolveIndexByUserId,
  checkSchema(createUserValidationSchema),
  (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      return response.status(400).send({ errors: result.array() });
    }

    const data = matchedData(request);
    const { findUserIndex } = request;

    mockedUsers[findUserIndex] = {
      id: mockedUsers[findUserIndex].id,
      ...data,
    };

    return response.sendStatus(200);
  }
);

// PARTIAL UPDATE USER (PATCH)
router.patch(
  "/api/users/:id",
  resolveIndexByUserId,
  checkSchema(updateUserValidationSchema),
  (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      return response.status(400).send({ errors: result.array() });
    }

    const data = matchedData(request);
    const { findUserIndex } = request;

    mockedUsers[findUserIndex] = {
      ...mockedUsers[findUserIndex],
      ...data,
    };

    return response.sendStatus(200);
  }
);

// DELETE USER
router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;

  mockedUsers.splice(findUserIndex, 1);

  return response.sendStatus(200);
});

export default router;
