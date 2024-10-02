import { matchedData, validationResult } from "express-validator";
import { mockedUsers } from "../utils/constants.mjs";
import { hashPassword } from "../utils/helpers.mjs";
import { User } from "../mongoose/schemas/user.mjs";

export const getUserByIdHandler = (request, response) => {
  // O usuário já foi encontrado e adicionado à requisição
  const { user } = request;

  return response.status(200).send(user);
};


export const createUserHandler = async (request, response) => {
  const result = validationResult(request);

  if (!result.isEmpty()) {
    return response.status(400).send(result.array());
  }

  const data = matchedData(request);
  data.password = hashPassword(data.password);
  const newUser = new User(data);
  try {
    const savedUser = await newUser.save();
    return response.status(201).send(savedUser);
  } catch (error) {
    return response.sendStatus(400);
  }
};
