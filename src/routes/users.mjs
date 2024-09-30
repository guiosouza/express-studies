import { Router } from "express";
import { validationResult, checkSchema, matchedData } from "express-validator";
import { mockedUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middleWares.mjs";
import {
  createUserValidationSchema,
  updateUserValidationSchema,
} from "../utils/validationSchemas.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";

const router = Router();

// GET ALL USERS
router.get("/api/users", (request, response) => {
  console.log(request.headers.cookie);
  console.log(request.cookies);
  console.log("request.signedCookies.hello: ", request.signedCookies.hello);

  if (request.signedCookies.hello && request.signedCookies.hello === "world") {
    return response.send(mockedUsers);
  }

  return response
    .status(403)
    .send({ message: "Sorry, you need the correct cookie" });
});

// GET USER BY ID
router.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;

  const findUser = mockedUsers[findUserIndex];

  if (!findUser) {
    return response.sendStatus(404);
  }

  return response.send(findUser);
});

// CREATE USER
router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  async (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      return response.status(400).send(result.array());
    }

    const data = matchedData(request);
    console.log("DATA: ", data);
    data.password = hashPassword(data.password);
    const newUser = new User(data);
    try {
      const savedUser = await newUser.save();
      return response.status(201).send(savedUser);
    } catch (error) {
      console.log(error);
      return response.sendStatus(400);
    }
  }
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
