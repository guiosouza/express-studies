import { Router } from "express";

const router = Router();

// GET ALL USERS
router.get("/api/users", (request, response) => {
  response.send([
    { id: 1, username: "guios", email: "guilherme@gmail.com" },
    { id: 2, username: "aldivio", email: "aldivio@gmail.com" },
    { id: 3, username: "gus", email: "gustavo@gmail.com" },
  ]);
});

export default router;
