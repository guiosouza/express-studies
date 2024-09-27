import { Router } from "express";

const router = Router();

// GET ALL USERS
router.get("/api/users", (request, response) => {

  console.log(request.headers.cookie);
  console.log(request.cookies);
  console.log("request.signedCookies.hello: ", request.signedCookies.hello);

  if ((request.signedCookies.hello && request.signedCookies.hello === "world")) {
    return response.send([
      { id: 1, username: "guios", email: "guilherme@gmail.com" },
      { id: 2, username: "aldivio", email: "aldivio@gmail.com" },
      { id: 3, username: "gus", email: "gustavo@gmail.com" },
    ]);
  }

  return response.status(403).send({ message: "Sorry, you need the correct cookie" });
});

export default router;
