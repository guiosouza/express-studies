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
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (request, response) => {
    console.log("request.session.id: ", request.session.id);

    request.sessionStore.get(request.session.id, (error, sessionData) => {
      if (error) {
        console.log("error: ", error);
        throw error;
      }
      console.log("Inside Session Store Get");
      console.log("sessionData:", sessionData);
    });

    const {
      query: { filter, value },
    } = request;

    if (filter && value) {
      response.send(mockedUsers.filter((user) => user[filter].includes(value)));
    }

    return response.send(mockedUsers);
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
